import { Dispatch, SetStateAction } from "react";
import { BoardItemProps } from "../../components/Board";
import { CardViewProps } from "../../components/Card";
import { GamePlayProps } from "../../components/Gameplay";
import { DestinationProps } from "../../components/Man";
import { PlayerPanelProps } from "../../components/Player";
import { Store } from "../../libs/gameStore";
import { canPutIslandChecker, getAvailableDestinations } from "../../model/logic";
import { PlayingState, GameCommand, PlayerStatus } from "../../model/store";

export type ViewState = {
    status: "Fetched",
    board: PlayingState,
    yourId: string,
    controller: Controller,
    store: Store<GameCommand>
} | {
    status: "Loading",
} | {
    status: "Error"
}

export type Controller = {
    type: "YourTurn",
} | {
    type: "SelectDestination",
    card: string,
} | {
    type: "StandBy"
}


export const finalize = (
    state: ViewState,
    setState: Dispatch<SetStateAction<ViewState>>,
): GamePlayProps => {
    switch (state.status) {
        case "Fetched":
            const you = state.board.players.find(player => player.base.id === state.yourId);
            if (!you) {
                throw new Error("Never");
            }
            const token = state.board.tokens.find(token => token.code === you.base.code);
            if (!token) {
                throw new Error("Never");
            }
            const canPut = canPutIslandChecker(state.board.map,state.board.tokens,you.base.code)
            const map: BoardItemProps[] =
                state.controller.type === "YourTurn" ? state.board.map.map(cell => {
                    return canPut(cell) ? {
                        ...cell,
                        select() {
                            state.store.dispatch({
                                type: "PUT_ISLAND",
                                value: {
                                    address:{
                                        x: cell.x,
                                        y: cell.y
                                    },
                                    player: you.base.code
                                }
                            })
                        }
                    } : cell
                }) : state.board.map
            const playerModelToViewProps = (player: PlayerStatus): PlayerPanelProps => {
                const isYou = player.base.code === you.base.code;
                return ({
                    you: isYou,
                    cards: player.cards.map<CardViewProps>(card => {
                        const selected = state.controller.type === "SelectDestination" && state.controller.card === card.id
                        return {
                            code: player.base.code,
                            hidden: !isYou,
                            id: card.id,
                            body: card.body,
                            selected,
                            select: !isYou ? undefined : () => {
                                setState(prev => {
                                    if (prev.status !== "Fetched") {
                                        throw new Error("Never")
                                    }
                                    return selected ? {
                                        ...prev,
                                        controller: {
                                            type: "YourTurn",
                                            card: card.id
                                        }
                                    } : {
                                        ...prev,
                                        controller: {
                                            type: "SelectDestination",
                                            card: card.id
                                        }
                                    }
                                })
                            }
                        }
                    }),
                    player: player.base
                })
            }
            const players: PlayerPanelProps[] = state.board.players.map(playerModelToViewProps);
            const cardToDestinationProps = (you: PlayerStatus, controller: Controller): DestinationProps[] | null => {
                console.log(token);
                if (controller.type === "SelectDestination") {
                    const card = you.cards.find(card => card.id === controller.card);
                    if (!card) {
                        throw new Error("Never");
                    }
                    return getAvailableDestinations(card.body, state.board.map, token,state.board.tokens)
                        .map<DestinationProps>(({ use, next }) => {
                            console.log({ use, next });
                            return {
                                async select() {
                                    setState(prev => ({
                                        ...prev,
                                        controller: {
                                            type: "StandBy"
                                        }
                                    }))
                                    await state.store.dispatch({
                                        type: "USE_CARD",
                                        value: {
                                            player: you.base.code,
                                            card: card.id,
                                            use
                                        }
                                    })
                                    setState(prev => ({
                                        ...prev,
                                        controller: {
                                            type: "YourTurn"
                                        }
                                    }))
                                },
                                ...next,
                                id: `${card.id}-${typeof use.direction === "string" ? use.direction : use.direction.join("-")}`,
                                code: token.code
                            }
                        })
                }
                return null
            }
            return {
                status: "Playing",
                map,
                tokens: state.board.tokens,
                players: players,
                destinations: cardToDestinationProps(you, state.controller)
            }

        case "Loading":
            return state
        case "Error":
            return state
    }
}

