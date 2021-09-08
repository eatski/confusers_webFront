import { Dispatch, SetStateAction } from "react";
import { BoardItemProps } from "../../components/Board";
import { CardViewProps } from "../../components/Card";
import { GamePlayProps } from "../../components/Gameplay";
import { DestinationProps } from "../../components/Man";
import { PlayerPanelProps } from "../../components/Player";
import { Store } from "../../libs/gameStore";
import { getAvailableDestinations, moveWithCard } from "../../model/logic";
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
    state:ViewState,
    setState: Dispatch<SetStateAction<ViewState>>,
):GamePlayProps => {
    switch (state.status) {
        case "Fetched":
            const you = state.board.players.find(player => player.base.id === state.yourId);
            if(!you){
                throw new Error("Never");
            }
            const token = state.board.tokens.find(token => token.code === you.base.code);
            if(!token){
                throw new Error("Never");
            }
            const map : BoardItemProps[] = 
                state.controller.type === "YourTurn" ? state.board.map.map(cell => {
                    return {
                        ...cell,
                        select(){
                            alert("TODO");
                        }
                    }
                }) : state.board.map
            const players : PlayerPanelProps[] = state.board.players.map(
                playerModelToViewProps(
                    state.board,setState,state.yourId
                )
            );
            const cardToDestinationProps = (you:PlayerStatus,controller:Controller):DestinationProps[] | null => {
                if(controller.type === "SelectDestination"){
                    const card = you.cards.find(card => card.id === controller.card);
                    if(!card){
                        throw new Error("Never");
                    }
                    return getAvailableDestinations(card.body).map<DestinationProps>(use => {
                        return {
                            async select(){
                                setState(prev => ({
                                    ...prev,
                                    controller: {
                                        type: "StandBy"
                                    }
                                }))
                                state.store.dispatch({
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
                            ...(moveWithCard(use, card.body,token)),
                            id: `${card.id}-${typeof use.direction === "string" ? use.direction : use.direction.join("-") }` ,
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
                players:players,
                destinations: cardToDestinationProps(you,state.controller)
            }
    
        case "Loading":
            return state
        case "Error":
            return state
    }
}

const playerModelToViewProps = (
    gameState: PlayingState,
    setState: Dispatch<SetStateAction<ViewState>>,
    yourId: string
) => (player: PlayerStatus): PlayerPanelProps => {
    const you = player.base.id === yourId;
    return ({
        you,
        cards: player.cards.map<CardViewProps>(card => ({
            code: player.base.code,
            hidden: !you,
            id: card.id,
            body: card.body,
            select: !you ? undefined : () => {
                setState(prev => {
                    const token = gameState.tokens.find(token => token.code === player.base.code);
                    if (!token) {
                        throw new Error("never");
                    }
                    if (prev.status !== "Fetched") {
                        throw new Error("Never")
                    }
                    return {
                        ...prev,
                        controller: {
                            type: "SelectDestination",
                            card: card.id
                        }
                    }
                })
            }
        })),
        player: player.base
    })
}
