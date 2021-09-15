import { recur } from "./util";

describe(recur.name,() => {
    test("正常系",() => {
        const ary = [1,2,3];
        const result : number = recur((next,number) => {
            const e = ary[number]
            return e ? e + next(number + 1) : 0
        },0)
        expect(result).toBe(6)
    })
})