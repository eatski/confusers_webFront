import { Dispatch, SetStateAction } from "react";
import { CardViewProps } from "../../components/Card";
import { GamePlayProps } from "../../components/Gameplay";
import { DestinationProps } from "../../components/Man";
import { PlayerPanelProps } from "../../components/Player";
import { Store } from "../../libs/gameStore";
import { getAvailableDestinations, moveWithCard } from "../../model/logic";
import { PlayingState, GameCommand, PlayerStatus } from "../../model/store";

const playerModelToViewProps = (
    gameState: PlayingState,
    setState: Dispatch<SetStateAction<GamePlayProps>>,
    store: Store<GameCommand>,
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
                    if (prev.status !== "Playing") {
                        throw new Error("Never")
                    }
                    return {
                        ...prev,
                        destinations: getAvailableDestinations(card.body)
                            .map<DestinationProps>(use => ({
                                select() {
                                    setState(prev => {
                                        if (prev.status !== "Playing") {
                                            throw new Error("Never")
                                        }
                                        return {
                                            ...prev,
                                            destinations: undefined
                                        }
                                    });
                                    store.dispatch({
                                        type: "USE_CARD",
                                        value: {
                                            player: player.base.code,
                                            card: card.id,
                                            use
                                        }
                                    })
                                },
                                ...(moveWithCard(use, card.body,token)),
                                code: player.base.code,
                                id: typeof use.direction === "string" ? use.direction : use.direction.join("_")
                            }))
                    }
                })
            }
        })),
        player: player.base
    })
}

export const onPlaying = (
    gameState: PlayingState,
    setState: Dispatch<SetStateAction<GamePlayProps>>,
    store: Store<GameCommand>,
    yourId: string
) => {
    const playerPanels = gameState.players.map<PlayerPanelProps>(
        playerModelToViewProps(gameState, setState, store, yourId)
    )
    setState({
        status: "Playing",
        map: gameState.map.map(e => ({
            ...e,
            select() {
                alert("TODO");
            }
        })),
        players: playerPanels,
        tokens: gameState.tokens
    })
}