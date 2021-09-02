import { CommandRecord, StoreLogic } from "../libs/gameStore"
import { createMap, pickCard, STARTING_ISLANDS } from "./logic"
import { Card, Cell, Player, Token } from "./types"

type State = {
    type: "STANDBY"
} | {
    type: "PLAYING",
    map: Cell[],
    tokens: Token[],
    players: PlayerStatus[]
}

type PlayerStatus = {
    cards: Card[],
    base: Player
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
        players: PlayerStatus[],
        map: Cell[],
        tokens: Token[]
    }
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
                    const gamePlayers = 
                        players.map((p,i) => (
                            {id:p.id,code: i,displayName:p.displayName}
                        ));
                    const tokens = gamePlayers.map((p,i) => {
                        const address = STARTING_ISLANDS[i]
                        if(address === undefined) throw new Error("STARTING_ISLANDSがプレイヤーの数に対して合ってません")
                        return {x:address.x,y:address.y,code:p.code}
                    })
                    const playersStatus = gamePlayers.map(p => {
                        return {
                            base:p,
                            cards: [1,2,3].map<Card>((id) => ({
                                id: `${p.code}-${id}`, //FIXME
                                body: pickCard()
                            }))
                        }
                    })
                    const result : Result = {
                        type:"CREATE_BOARD",
                        value: {
                            players: playersStatus,
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
                        players:result.value.players,
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