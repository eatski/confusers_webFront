import { useEffect, useState } from "react";
import { getRoomId } from "../../clientData/room";
import { YourIdClientImpl } from "../../clientData/you";
import { GamePlayProps } from "../../components/Gameplay";
import { logic } from "../../model/store";
import { createStore } from "../../libs/gameStore";
import { getMeetingPlayerRepository } from "../../repository/meetingPlayer";
import { getRecordRepository } from "../../repository/record";
import { finalize, ViewState } from "./finalize";



export const useGamePlay = (): GamePlayProps => {
    const [state, setState] = useState<ViewState>({
        status: "Loading"
    });

    useEffect(() => {
        const yourIdClient = new YourIdClientImpl(getRoomId());
        const yourId = yourIdClient.get();
        if(!yourId){
            throw new Error("No Your Id")
        }
        const meetingPlayerRepo = getMeetingPlayerRepository();
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
                        setState(prev => ({
                            status: "Fetched",
                            board: gameState,
                            yourId,
                            controller: prev.status === "Fetched" ? prev.controller : {type: "YourTurn"},
                            store
                        }))
                }
            },
            getRecordRepository()
        );
        
        return () => {
            store.removeListener();
        }
    }, [])

    return finalize(state,setState);
}

