import { CommandRecord, StoreLogic } from "exprocess"
import { canPutIslandChecker, createCards, createMap, excludeCards, moveWithCard, pickCard, pickCards, STARTING_ISLANDS, toCardUseWithBody } from "./logic"
import { Address, Card, CardUse, Cell, Player, Token } from "./types";
import { recur } from "../libs/util";

export type GameState = {
    type: "STANDBY"
} | PlayingState

export type PlayingState = {
    type: "PLAYING",
    map: Cell[],
    tokens: Token[],
    players: PlayerStatus[]
}

export type PlayerStatus = {
    cards: Card[],
    base: Player
}

export type GameCommand = {
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
} | {
    type: "PUT_ISLAND",
    value: {
        address: Address,
        player: number
    }
}

export type GameResult = {
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
} | {
    type: "PUT_ISLAND",
    value: Address
}

const invalidType: () => never = () => {
    throw new Error("invalidType")
}

export type MyRecord = CommandRecord<GameCommand, GameResult>

export const logic: StoreLogic<GameState, GameCommand, GameResult> = {
    initial: {
        type: "STANDBY"
    },
    script(prev, command) {
        switch (command.type) {
            case "START":
                if (prev.type === "STANDBY") {
                    const { players } = command.value;
                    const gamePlayers =
                        players.map((p, i) => (
                            { id: p.id, code: i, displayName: p.displayName }
                        ));
                    const tokens = gamePlayers.map((p, i) => {
                        const address = STARTING_ISLANDS[i]
                        if (address === undefined) throw new Error("STARTING_ISLANDSがプレイヤーの数に対して合ってません")
                        return { x: address.x, y: address.y, code: p.code }
                    })
                    const CARDS_NUM = 4
                    const playersStatus : PlayerStatus[] = recur((next,cards,participants,code) => {
                        const [participant,...remainedParticipant] = participants
                        if(!participant){
                            return []
                        }
                        const {picked,remained} = pickCards(cards,CARDS_NUM);
                        const player : PlayerStatus = {
                            cards:picked,
                            base: {
                                code,
                                displayName:participant.displayName,
                                id: participant.id
                            }
                        }
                        return [player,...next(remained,remainedParticipant,code + 1)]
                    },createCards(),gamePlayers,0)
                    const result: GameResult = {
                        type: "CREATE_BOARD",
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
                if (prev.type !== "PLAYING") {
                    invalidType();
                }
                const { value } = command;
                const player = prev.players.find(p => p.base.code === value.player);
                if (!player) {
                    invalidType();
                }
                const card = player.cards.find(card => card.id === value.card);
                if (!card) {
                    invalidType();
                }
                const token = prev.tokens.find(token => token.code === player.base.code);
                if (!token) {
                    invalidType();
                }
                const cardUseWithBody = toCardUseWithBody(card.body,value.use);
                switch (cardUseWithBody.type) {
                    case "Curved":
                    case "Straight":
                        const moveTo = moveWithCard(cardUseWithBody, { x: token.x, y: token.y }, prev.map, prev.tokens);
                        const newCard = pickCard(excludeCards(
                            recur((next,players) => {
                                const [player,...remained] = players;
                                return player ? [...player.cards,...next(remained)] : []
                            },prev.players)
                        )).picked
                        const result: GameResult = {
                            type: "MOVE_TOKEN_WITH_CARD",
                            value: {
                                player: value.player,
                                token: {
                                    code: value.player,
                                    ...moveTo
                                },
                                newCard,
                                usedCard: value.card
                            }
                        }
                        return result;
                
                    case "AnywhereBuild":
                        throw new Error("TODO")
                }
            case "PUT_ISLAND":
                if (prev.type !== "PLAYING") {
                    invalidType();
                }
                if (canPutIslandChecker(prev.map, prev.tokens, command.value.player)(command.value.address)) {
                    return {
                        type: "PUT_ISLAND",
                        value: command.value.address
                    }
                }
                invalidType();
        }
    },
    reducer(prev, result) {
        switch (result.type) {
            case "CREATE_BOARD":
                if (prev.type === "STANDBY") {
                    return {
                        type: "PLAYING",
                        players: result.value.players,
                        map: result.value.map,
                        tokens: result.value.tokens
                    }
                }
                invalidType()

            case "MOVE_TOKEN_WITH_CARD":
                if (prev.type === "PLAYING") {
                    return {
                        ...prev,
                        tokens: prev.tokens.map<Token>(
                            token => token.code !== result.value.token.code ? token
                                : result.value.token
                        ),
                        players: prev.players.map<PlayerStatus>(
                            player => player.base.code !== result.value.player ? player : {
                                base: player.base,
                                cards: [...player.cards.filter(card => card.id !== result.value.usedCard), result.value.newCard]
                            }
                        )
                    }
                }
                invalidType()

            case "PUT_ISLAND":
                if (prev.type === "PLAYING") {
                    return {
                        ...prev,
                        map: prev.map.map<Cell>(
                            cell => cell.x === result.value.x && cell.y === result.value.y ? { ...cell, content: { type: "ISLAND" } } : cell
                        )
                    }
                }
                invalidType()
        }

    }
}