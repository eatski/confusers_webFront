import { useEffect, useState } from "react";
import { getRoomId } from "../../clientData/room";
import { YourIdClientImpl } from "../../clientData/you";
import { GamePlayProps } from "../../components/Gameplay";
import { logic } from "../../model/store";
import { createStore } from "../../libs/gameStore";
import { getMeetingPlayerRepository } from "../../repository/meetingPlayer";
import { getRecordRepository } from "../../repository/record";
import { PlayerPanelProps } from "../../components/Player";
import { CardViewProps } from "../../components/Card";
import { getAvailableDestinations, moveWithCard } from "../../model/logic";
import { DestinationProps } from "../../components/Man";

export const useGamePlay = (): GamePlayProps => {
    const [state, setState] = useState<GamePlayProps>({
        status: "Loading"
    })
    useEffect(() => {
        const yourIdClient = new YourIdClientImpl(getRoomId());
        const yourId = yourIdClient.get();
        if(!yourId){
            throw new Error("No Your Id")
        }
        const meetingPlayerRepo = getMeetingPlayerRepository();
        const recordRepo = getRecordRepository();
        const store = createStore(
            logic,
            (_ ,gameState) => {
                switch (gameState.type) {
                    case "STANDBY":
                        meetingPlayerRepo.getPlayers().then(players => {
                            if (players.isHost()) {
                                const gamePlayers = players
                                    .getAll()
                                    .map((p,i) => ({code: i,displayName:p.displayName,id:p.id}))
                                store.dispatch({
                                    type:"START",
                                    value: {
                                        players: gamePlayers
                                    }
                                })
                            }
                        })
                        return;
                    case "PLAYING":
                        const playerPanels = gameState.players.map<PlayerPanelProps>(p => {
                            const you = p.base.id === yourId;
                            //FIXME: モデルにロジック
                            const token = gameState.tokens.find(token => token.code === p.base.code);
                            if(!token){
                                throw new Error("never");
                            }
                            return ({
                                you,
                                cards:p.cards.map<CardViewProps>(card => ({
                                    code:p.base.code,
                                    hidden: !you,
                                    id: card.id,
                                    body:card.body,
                                    select() {
                                        setState(prev => {
                                            if(prev.status !== "Playing"){
                                                throw new Error("Never")
                                            }
                                            return {
                                                ...prev,
                                                destinations:getAvailableDestinations(card.body)
                                                    .map<DestinationProps>(use => ({
                                                        select() {
                                                            setState(prev => {
                                                                if(prev.status !== "Playing"){
                                                                    throw new Error("Never")
                                                                }
                                                                return {
                                                                    ...prev,
                                                                    destinations: undefined
                                                                }
                                                            });
                                                            store.dispatch({
                                                                type:"USE_CARD",
                                                                value: {
                                                                    player: p.base.code,
                                                                    card: card.id,
                                                                    use
                                                                }
                                                            })
                                                        },
                                                        ...(moveWithCard(use,card.body,token)),
                                                        code: p.base.code,
                                                        id: typeof use.direction === "string" ? use.direction : use.direction.join("_")
                                                }))
                                            }
                                        })
                                    }
                                })),
                                player:p.base
                            })
                        })
                        setState({
                            status:"Playing",
                            map:gameState.map,
                            players:playerPanels,
                            tokens: gameState.tokens
                        })
                        return 
                }
            },
            recordRepo
        );
        
        return () => {
            store.removeListener();
        }
    }, [])

    return state;
}