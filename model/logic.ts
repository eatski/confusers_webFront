import { CardBody, Cell, SYMBOLS, SymbolType } from "./types";

const rnd = (num:number) =>  Math.floor(Math.random() * num);
const pickRnd = <T>(array:T[]):[T,T[]] => {
    const pickedIndex = rnd(array.length);
    const picked = array[pickedIndex];
    if(!picked){
        throw new Error("Never")
    }
    const newArray = array.filter((_,i) => i !== pickedIndex);
    return [picked,newArray]
}

type Address = {x:number,y:number}
export const STARTING_ISLANDS : Address []= [{x:6,y:6},{x:7,y:6},{x:6,y:7},{x:7,y:7}];
const allowedProximityNum = 4;
export const createMap = ():Cell[] => {
    const MAP_SIZE = [...Array(14)].map((_,i) => i);
    const addresses : Address[] = MAP_SIZE.reduce<Address[]>((acc,x) => MAP_SIZE.reduce<Address[]>((acc,y) => [...acc,{x,y}],acc),[])
    
    const isAllowedProximity = (a:Address,b:Address):boolean => {
    return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y)) > allowedProximityNum
}
    //FIXME: Shuffle??
    const [_,symbols] = SYMBOLS.reduce<[Address[],[SymbolType,Address][]]>(([addresses,acc],cur) => {
        const [picked,left] = pickRnd(addresses);
        const removed = left.filter(
            e => isAllowedProximity(e,picked)
        )
        return [removed,[...acc,[cur,picked]]]
    },[
        addresses.filter((address) => !STARTING_ISLANDS.some(start => !isAllowedProximity(address,start))),
        []
    ]);
    
    return addresses.map<Cell>(({x,y}) => {
        if(STARTING_ISLANDS.some(e => e.x === x && e.y === y)){
            return {
                x,
                y,
                content:{
                    type:"ISLAND"
                }
            }
        }
        const symbolResult = symbols.find(([_,e]) => e.x === x && e.y === y);
        if(symbolResult){
            const [symbol] = symbolResult;
            return {
                x,
                y,
                content:{
                    type:"SYMBOL",
                    symbol
                }
            }
        }
        return {
            x,
                y,
                content:{
                    type:"SEA"
                }
        }
    })
}

export const createCards : () => CardBody[] = () => {
    const MAP_SIZE = [...Array(allowedProximityNum)].map((_,i) => i + 1);
    const straight : CardBody[] = MAP_SIZE.map(number => ({
        type: "Straight",
        number
    }));
    const curved : CardBody[] = 
        MAP_SIZE.reduce<CardBody[]>(
            (acc,num1) => MAP_SIZE.reduce<CardBody[]>((acc,num2) => num1 + num2 > allowedProximityNum ? acc : [...acc,{type:"Curved",number:[num1,num2]}],acc),[])

    return [...straight,...curved]
}

export const pickCard = ():CardBody => {
    const cards = createCards();
    const [card] = pickRnd(cards);
    return card;
}