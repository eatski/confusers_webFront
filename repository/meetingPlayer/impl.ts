import * as t from "io-ts";
import { MeetingPlayer, PlayersList, PLAYERS_NUM } from "../../model/player";
import firebase from "firebase";
import { getStore } from "../../database/firestore";
import { log } from "../../logger";
import { YourIdClient } from "../../clientData/you";

const PlayerInputIO = t.type({
    name:t.string,
    host: t.boolean
});

const PlayerOutputIO = t.intersection([PlayerInputIO,t.type({
    registeredAt: t.number,
})])

type PlayerInput = t.TypeOf<typeof PlayerInputIO>;

type RegisterResult = {
    success: true,
    id: string
} | {
    success: false,
    cause: "UNEXPECTED_ERROR" | "OVER_CAPACITY"
}

const dataToModel = (fetched:firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>,yourId: string | null):PlayersList => {
    return new PlayersList(fetched.docs.map<MeetingPlayer>(e => {
        const io = e.data();
        const decoded = PlayerOutputIO.decode(io);
        if(decoded._tag === "Left"){
            log(decoded.left.join(","));
            throw decoded.left;
        }
        const data  = decoded.right;
        return {
            id:e.id,
            displayName: data.name,
            registeredAt: data.registeredAt,
            you: yourId === e.id,
            host: data.host
        }
    }));
}

export class MeetingPlayerRepository {
    constructor(private yourIdDao:YourIdClient,private roomId: string){};
    public async registerMeetingPlayer(player:PlayerInput):Promise<RegisterResult>{
        const store = getStore();
        const roomDoc = store.collection("rooms").doc(this.roomId);
        const playersCol = roomDoc.collection("players");
        const res = await store.runTransaction<RegisterResult>(async (t) => {
            if((await playersCol.get()).size < PLAYERS_NUM){
                const doc = playersCol.doc();
                await t.set(doc,{
                    ...player,
                    registeredAt:Date.now()
                });
                this.yourIdDao.save(doc.id)
                return {
                    success:true,
                    id: doc.id
                }
            }
            return {
                success:false,
                cause: "OVER_CAPACITY"
            }
        }).catch<RegisterResult>(() => ({success:false,cause:"UNEXPECTED_ERROR"}));
        return res;
    }
    public syncMeetingPlayers(
        listener:(players: PlayersList) => void,
        onError: () => void
    ) {
        const store = getStore();
        const roomDoc = store.collection("rooms").doc(this.roomId);
        const playersCol = roomDoc.collection("players").orderBy("registeredAt");
        const onFetched = ((fetched : firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>)=> {
            try {
                const yourId = this.yourIdDao.get();
                listener(dataToModel(fetched,yourId));
            } catch (error) {
                log(error);
                onError();
            }
        })
        playersCol.get().then(onFetched).catch(onError);
        return playersCol.onSnapshot(onFetched,onError);
    }

    public async deletePlayer() {
        const yourId = this.yourIdDao.get();
        if(!yourId){
            throw new Error("No your id")
        }
        const store = getStore();
        const roomDoc = store.collection("rooms").doc(this.roomId);
        const playersCol = roomDoc.collection("players");
        await playersCol.doc(yourId).delete();
        this.yourIdDao.delete();
    }

    public async getPlayers(): Promise<PlayersList> {
        const store = getStore();
        const roomDoc = store.collection("rooms").doc(this.roomId);
        const playersCol = roomDoc.collection("players").orderBy("registeredAt");
        const data = await playersCol.get()
        return dataToModel(data,this.yourIdDao.get());
    }   
}
