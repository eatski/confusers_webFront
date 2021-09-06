import { CommandRecord, StoreLogic } from "../libs/gameStore"
import { createMap, moveWithCard, pickCard, STARTING_ISLANDS } from "./logic"
import { Card, CardUse, Cell, Player, Token } from "./types";
import {v4 as uuid} from "uuid";

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
} | {
    type: "USE_CARD",
    value: {
        player: number,
        card: string,
        use: CardUse
    }
}

export type Result = {
    type: "MOVE_TOKEN_WITH_CARD",
    value: {
        player: number,
        token: Token,
        usedCard: string,
        newCard: Card 
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
                                id: uuid(),
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
            case "USE_CARD":
                if(prev.type !== "PLAYING"){
                    invalidType();
                }
                const {value} = command;
                const player = prev.players.find(p => p.base.code === value.player);
                if(!player){
                    invalidType();
                }
                const card = player.cards.find(card => card.id === value.card);
                if(!card){
                    invalidType();
                }
                const token = prev.tokens.find(token => token.code === player.base.code);
                if(!token){
                    invalidType();
                }
                const moveTo = moveWithCard(value.use,card.body,{x:token.x,y:token.y});
                const result : Result = {
                    type: "MOVE_TOKEN_WITH_CARD",
                    value: {
                        player: value.player,
                        token: {
                            code: value.player,
                            ...moveTo
                        },
                        newCard: {
                            id: uuid(),
                            body: pickCard()
                        },
                        usedCard:value.card
                    }
                }
                return result

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

            case "MOVE_TOKEN_WITH_CARD":
                if(prev.type === "PLAYING"){
                    return {
                        ...prev,
                        tokens: prev.tokens.map<Token>(
                            token => token.code !== result.value.token.code ? token
                                : result.value.token
                            ),
                        players:prev.players.map<PlayerStatus>(
                            player => player.base.code !== result.value.player ? player : {
                                base:player.base,
                                cards: [...player.cards.filter(card => card.id !== result.value.usedCard),result.value.newCard]
                            }
                        )
                    }
                }
                throw new Error("TODO");

        }

    }
}