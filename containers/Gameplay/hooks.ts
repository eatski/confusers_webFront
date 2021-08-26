import { useEffect, useState } from "react";
import { getRoomId } from "../../clientData/room";
import { YourIdClientImpl } from "../../clientData/you";
import { GamePlayProps } from "../../components/Gameplay";
import { createMap } from "../../model/mapData";
import { GamePlayer } from "../../model/player";
import { getGamePlayRepository } from "../../repository/game";
import { getMeetingPlayerRepository } from "../../repository/meetingPlayer";

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
        const gameRepo = getGamePlayRepository();
        (async () => {
            const players = await meetingPlayerRepo.getPlayers();
            if (players.isHost()) {
                const gamePlayers = players.getAll().map((p,i) => ({code: i,displayName:p.displayName,id:p.id}))
                gameRepo.dispatch({
                    type: "Init",
                    value: {
                        players: gamePlayers,
                        map: createMap(),
                        men: gamePlayers.map((p,i) => ({x:i,y:i,code: p.code}))
                    }
                })
            }
        })()
        return gameRepo.syncActions((actions) => {
            actions.forEach(action => {
                switch (action.type) {
                    case "Init":
                        setState({
                            status: "Playing",
                            map: action.value.map,
                            players: action.value.players.map<{meta:GamePlayer}>((p) => {
                                return {
                                    meta: {
                                        code: p.code,
                                        displayName: p.displayName,
                                        you: p.id === yourId
                                    }
                                }
                            }),
                            men: action.value.men
                        })
                        return;
                }
            })
        }, () => {
            setState({
                status: "Error"
            })
        })
    }, [])

    return state;
}