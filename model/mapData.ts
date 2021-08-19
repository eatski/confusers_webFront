import {flatten} from "lodash-es";

const to15 = [...Array(16)].map((_,i) => i)
const to6 = [...Array(4)].map((_,i) => i)
const to3 = [...Array(4)].map((_,i) => i)

const x3y3 = (x:number,y:number) => to3.reduce<[number,number][]>((prev,cur) => to3.map<[number,number]>(num => [cur + x,num + y]).concat(prev),[])
const pick = (array:[number,number][],num: number):[number,number][] => {
    const fn = (cur:[number,number][],num: number,acc: [number,number][]):[number,number][] => {
        if(num > 0 && cur.length > 0) {
            const rnd = Math.floor(Math.random() * cur.length);
            const picked = cur[rnd]
            if(typeof picked === "undefined"){
                throw new Error("Never. Never.")
            }
            const [pickdX,pickedY] = picked;
            const removed = cur.filter(([x,y],index) => index !== rnd && !(Math.abs(x - pickdX) <= 1 && Math.abs(y - pickedY) <= 1 && Math.abs(x - pickdX) !== Math.abs(y - pickedY)))
            return fn(removed,num - 1,[...acc,picked]);
        }
        return acc;
    }
    return fn(array,num,[])
};

const islands = flatten(to6.map(y => flatten(to6.map(x => pick(x3y3(x * 4,y *4),x === 0 || y === 0 ? 5 : 5)))))

export const createMap = ():MapData => to15.map(y => to15.map(x => !!islands.find(([_x,_y]) => y === _y && x === _x) ? "Island" : "Sea"))

export type MapData = CellType[][];

export type CellType = "Sea" | "Island"
