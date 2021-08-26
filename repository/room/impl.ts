import * as t from "io-ts";
import { getStore } from "../../database/firestore";
import firebase from "firebase";
import { Phase } from "../../model/room";

const PhaseIO = t.union([t.literal("Meeting"),t.literal("GamePlay"),t.literal("Dissolution"),]) 

const RoomIO = t.type({
    phase: PhaseIO
})

export class RoomRepository {
    constructor(private roomId: string){}
    public async startGame() {
        const store = getStore();
        const room = store.collection("rooms").doc(this.roomId);
        await room.set({
            phase: "GamePlay"
        })
    }
    public syncRoomPhase(listener:(phase: Phase) => void,onError : () => void): () => void {
        const store = getStore();
        const room = store.collection("rooms").doc(this.roomId);
        const fn = (e:firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>) => {
            const io = e.data();
            const decoded = RoomIO.decode(io);
            if(decoded._tag === "Right"){
                const data = decoded.right;
                listener(data.phase);
            } else {
                onError()
            }
        }   
        room.get().then(fn).catch(onError);
        return room.onSnapshot(fn);
    }
}