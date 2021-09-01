import { getStore } from "../../database/firestore";
import { MyRecord } from "../../model/store";
import { RecordRepository } from "../../libs/gameStore";

const SEQ_NO_KEY = "__seqNo"
export class RecordRepositoryImpl implements RecordRepository<MyRecord>{
    constructor(private roomId: string){}
    async add({command,result}: MyRecord){
        const store = getStore();
        const recordsRef = store.collection("rooms").doc(this.roomId).collection("records");
        await store.runTransaction(async t => {
            const list = await recordsRef.get();
            const doc = recordsRef.doc();
            await t.set(doc,{
                command:JSON.stringify(command),
                result:JSON.stringify(result),
                [SEQ_NO_KEY]: list.size
            })
        })
    }
    listen(listener: (record: MyRecord) => void) {
        const store = getStore();
        const recordsRef = store.collection("rooms").doc(this.roomId).collection("records");
        return recordsRef.orderBy(SEQ_NO_KEY).onSnapshot(snapshot => {
            snapshot.docChanges().forEach(e => {
                if(e.type !== "added"){
                    throw new Error("Invalid Command")
                }
                //FXIME: type
                const data = e.doc.data()
                const {command,result} = {command: JSON.parse(data.command),result:JSON.parse(data.result)} as MyRecord;
 
                listener({command,result})
            })
        })
    }

}