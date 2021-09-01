import { CommandRecord, StoreLogic } from "../libs/gameStore"
import { Cell, CellContent, Player, Token } from "./types"

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
const STARTING_ISLANDS = [{x:5,y:5},{x:5,y:6},{x:6,y:5},{x:6,y:6}]
const MAP_SIZE = [...Array(12)].map((_,i) => i);
const createMap = ():Cell[] => {
    return MAP_SIZE.reduce<Cell[]>((acc,x) => {
        return MAP_SIZE.reduce<Cell[]>((acc,y) => {
            const content : CellContent = STARTING_ISLANDS.find(e => e.x === x && e.y === y) ? {
                type: "ISLAND",
            } : {
                type: "SEA"
            }
            return [...acc,{x,y,content}]
        },acc)
    },[])
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