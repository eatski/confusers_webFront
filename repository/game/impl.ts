import { getStore } from "../../database/firestore";
import * as t from "io-ts";
import firebase from "firebase";
import { log } from "../../logger";

const PlayerIO = t.type({
    id: t.string,
    code: t.number,
    displayName: t.string,
})

const ManIO = t.type({
    x: t.number,
    y: t.number,
    code: t.number
})

const MapCellIO = t.union([t.literal("Island"),t.literal("Sea")])
const ActionIO = t.union([
    t.type({
        type: t.literal("Init"),
        value: t.type({
            players: t.array(PlayerIO),
            map: t.array(t.array(MapCellIO)),
            men: t.array(ManIO)
        })
    }),
    t.type({
        type: t.literal("MoveMan"),
        value: ManIO
    })
])

type Action = t.TypeOf<typeof ActionIO>

export class GamePlayRepository {
    constructor(private roomId:string){}
    async dispatch(action: Action){
        const store = getStore();
        const roomDoc = store.collection("rooms").doc(this.roomId);
        const actionCol = roomDoc.collection("actions");
        const data = {
            ...action,
            at: Date.now()
        }
        await actionCol.add({json:JSON.stringify(data)});
    };
    syncActions(listener: (actions:Action[])=>void,onError: () => void):() => void {
        const store = getStore();
        const roomDoc = store.collection("rooms").doc(this.roomId);
        const actionCol = roomDoc.collection("actions");
        const fn = (fetched: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => {
            try {
                const data = fetched.docs.map(e => {
                    const decoded = ActionIO.decode(JSON.parse(e.data().json))
                    if(decoded._tag === "Right"){
                        return decoded.right
                    }
                    throw decoded.left
                })
                listener(data);
            } catch (e) {
                log(e);
                onError();
            }
        }
        actionCol.get().then(fn).catch(onError);
        return actionCol.onSnapshot(fn);
    }


}