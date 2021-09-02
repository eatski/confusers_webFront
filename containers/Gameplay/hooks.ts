import { useEffect, useState } from "react";
import { getRoomId } from "../../clientData/room";
import { YourIdClientImpl } from "../../clientData/you";
import { GamePlayProps } from "../../components/Gameplay";
import { logic } from "../../model/store";
import { createStore } from "../../libs/gameStore";
import { getMeetingPlayerRepository } from "../../repository/meetingPlayer";
import { getRecordRepository } from "../../repository/record";
import { PlayerPanelProps } from "../../components/Player";

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
            (_ ,state) => {
                console.log(state);
                switch (state.type) {
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
                        const playerPanels = 
                        state.players.map<PlayerPanelProps>(p => ({you: p.base.id === yourId,cards:p.cards,player:p.base}))
                        setState({
                            status:"Playing",
                            map:state.map,
                            players:playerPanels,
                            tokens: state.tokens
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