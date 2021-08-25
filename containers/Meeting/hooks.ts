import { useEffect, useState } from "react";
import { MeetingProps } from "../../components/Meeting";
import { getMeetingPlayerDAO } from "../../data/meetingPlayer";
import { PLAYERS_NUM } from "../../model/player";

export const useMeeting = (): MeetingProps => {
    const [state,setState] = useState<MeetingProps>({
        status:"Fetching"
    })
    useEffect(() => {
        const meetingPlayerDao = getMeetingPlayerDAO();
        const leave = async () => {
            meetingPlayerDao.deletePlayer();
        }
        const register = async (name: string) => {
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
            const result = await meetingPlayerDao.registerMeetingPlayer({
                name,
                registeredAt: Date.now()
            });
            if(!result.success){
                setState({
                    status: "Error"
                })
            }
        }
        return meetingPlayerDao.syncMeetingPlayers(
            (players) => {
                const joined = !!players.find(e => e.you);
                const over = players.length >= PLAYERS_NUM
                console.log(joined,over)
                setState({
                    status: "Fetched",
                    players,
                    form: joined ? {
                        status:"Joined",
                        leave
                    } : over ? {
                        status: "Over"
                    } : {
                        status: "Inputable",
                        onInput: register
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