import { getStore } from "../../database/firestore";
import { GameCommand, GameResult } from "../../model/store";
import { CommandRecord, RecordRepository } from "../../libs/gameStore";

const SEQ_NO_KEY = "__seqNo"

export const createFirestoreRecordRepository = (roomId:string):RecordRepository<GameResult,GameCommand> => {
    const store = getStore();
    const recordsRef = store.collection("rooms").doc(roomId).collection("records");
    return {
        add({command,result}) {
            const doc = recordsRef.doc();
            return {
                id:doc.id,
                exec(){
                    return store.runTransaction(async t => {
                        const list = await recordsRef.get();
                        await t.set(doc,{
                            command:JSON.stringify(command),
                            result:JSON.stringify(result),
                            id:doc.id,
                            [SEQ_NO_KEY]: list.size
                        })
                    })
                }
            }
        },
        sync(listener){
            return recordsRef.onSnapshot(snapshot => {
                const records = snapshot.docChanges().map(e => {
                    if(e.type !== "added"){
                        throw new Error("Invalid Command")
                    }
                    //FXIME: type
                    const data = e.doc.data()
                    return {command: JSON.parse(data.command),result:JSON.parse(data.result),id:data.id} as CommandRecord<GameResult,GameCommand>;
        
                })
                listener(records);
            })
        }
    }
}
