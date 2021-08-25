import { getStore } from "./firestore";

const store = getStore();
afterAll(() => store.terminate());

test("1",async () => {
    const roomCol = store.collection("rooms");
    const roomid = roomCol.doc().id;
    const playersCol = roomCol.doc(roomid).collection("players");
    await Promise.all([
        playersCol.add({
            name:"hoge"
        }),
        playersCol.add({
            name:"fuga"
        }),
    ])
    const res = await playersCol.get();
    const data = res.docs.map(e => e.data());
    expect(data).toEqual(expect.arrayContaining([{ name: 'fuga' },{ name: 'hoge' }]));
})

test("2",async () => {
    await expect(store.collection("rooms").get()).rejects.toBeTruthy()

})
