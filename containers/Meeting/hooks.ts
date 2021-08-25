import { useEffect, useState } from "react";
import { MeetingProps } from "../../components/Meeting";
import { syncMeetingPlayers, registerMeetingPlayer } from "../../data/players";
import { getYourId, saveYourId } from "../../data/you";
import { log } from "../../logger";
import { PLAYERS_NUM } from "../../model/player";


export const useMeeting = (): MeetingProps => {
    const [state,setState] = useState<MeetingProps>({
        status:"Fetching"
    })
    useEffect(() => {
        const roomId = new URLSearchParams(window.location.search).get("room");
        if(!(typeof roomId === "string")){
            log("roomid missing")
            setState({
                status:"Error"
            })
            return;
        }
        const yourId = getYourId();
        const onInput = async (name: string) => {
            setState(prev => {
                switch (prev.status) {
                    case "Fetched":
                        return {
                            status: "Fetched",
                            players: prev.players,
                            form: {
                                status:"Registering"
                            }
                        }
                    default:
                        return {
                            status: "Error"
                        };
                }
            })
            const result = await registerMeetingPlayer(roomId,{
                name,
                registeredAt: Date.now()
            });
            if(result.success){
                saveYourId(result.id);
                setState(prev => {
                    switch (prev.status) {
                        case "Fetched": 
                            return {
                                status: "Fetched",
                                players:prev.players,
                                form: {
                                    status: "Joined"
                                }
                            }
                        default:
                            return {
                                status: "Error"
                            };
                    }
                })
            }
        }
        return syncMeetingPlayers(
            roomId,
            yourId,
            (players) => {
                const joined = !!players.find(e => e.you);
                const over = players.length >= PLAYERS_NUM
                setState(prev => {
                    switch (prev.status) {
                        case "Fetched":
                        case "Fetching":
                            return {
                                status: "Fetched",
                                players,
                                form: joined ? {
                                    status:"Joined"
                                } : over ? {
                                    status: "Over"
                                } : prev.status === "Fetched" ? prev.form : {
                                    status: "Inputable",
                                    onInput
                                }
                    
                            }
                        default:
                            return {
                                status: "Error"
                            }
                    }
                })
            },
            () => {
                setState({
                    status:"Error"
                })
            }
        )
        
    },[])
    
    return state
}