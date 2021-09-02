import { CommandRecord, StoreLogic } from "../libs/gameStore"
import { Cell, CellContent, Player, SYMBOLS, SymbolType, Token } from "./types"

type State = {
    type: "STANDBY"
} | {
    type: "PLAYING",
    players: Player[],
    map: Cell[],
    tokens: Token[]
}

export type Command = {
    type: "START",
    value: {
        players: Player[]
    }
} 

export type Result = {
    type: "MOVE_TOKEN",
    value: {
        token: Token 
    }
} | {
    type: "CREATE_BOARD",
    value: {
        players: Player[],
        map: Cell[],
        tokens: Token[]
    }
}
type Address = {x:number,y:number}
const STARTING_ISLANDS : Address []= [{x:6,y:6},{x:7,y:6},{x:6,y:7},{x:7,y:7}];

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

const createMap = ():Cell[] => {
    const MAP_SIZE = [...Array(14)].map((_,i) => i);
    const addresses : Address[] = MAP_SIZE.reduce<Address[]>((acc,x) => MAP_SIZE.reduce<Address[]>((acc,y) => [...acc,{x,y}],acc),[])
    const allowedProximityNum = 4;
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

const invalidType : () => never = () => {
    throw new Error("invalidType")
}

export type MyRecord = CommandRecord<Command,Result>

export const logic : StoreLogic<State,Command,Result> = {
    initial: {
        type:"STANDBY"
    },
    script(prev,command) {
        switch (command.type) {
            case "START":
                if(prev.type === "STANDBY"){
                    const {players} = command.value;
                    const gamePlayers = players.map((p,i) => ({id:p.id,code: i,displayName:p.displayName}));
                    const tokens = gamePlayers.map((p,i) => {
                        const address = STARTING_ISLANDS[i]
                        if(address === undefined) throw new Error("STARTING_ISLANDSがプレイヤーの数に対して合ってません")
                        return {x:address.x,y:address.y,code:p.code}
                    })
                    const result : Result = {
                        type:"CREATE_BOARD",
                        value: {
                            players: gamePlayers,
                            tokens,
                            map: createMap()
                        }
                    }
                    
                    return result
                }
                invalidType()
        }
    },
    reducer(prev,result) {
        switch (result.type) {
            case "CREATE_BOARD":
                if(prev.type === "STANDBY"){
                    return {
                        type: "PLAYING",
                        players: result.value.players,
                        map: result.value.map,
                        tokens: result.value.tokens
                    }
                }
                invalidType()

            case "MOVE_TOKEN":
                throw new Error("TODO");

        }

    }
}