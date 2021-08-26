import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MeetingProps } from "../../components/Meeting";
import { getMeetingPlayerDAO } from "../../data/meetingPlayer";
import { getRoomId } from "../../data/room";
import { PLAYERS_NUM } from "../../model/player";

export const useMeeting = (): MeetingProps => {
    const [state,setState] = useState<MeetingProps>({
        status:"Fetching"
    })
    const router = useRouter();
    useEffect(() => {
        const meetingPlayerDao = getMeetingPlayerDAO();
        const leave = async () => {
            meetingPlayerDao.deletePlayer();
        }
        const join = async (name: string) => {
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
                host:false
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
                const over = players.length >= PLAYERS_NUM;
                const host = !!players.find(e => e.you && e.host);
                setState({
                    status: "Fetched",
                    players,
                    form: host ? {
                        status: "Joined_As_Host",
                        start(){
                            router.push(`/gameplay?room=${getRoomId()}`)
                        },
                        dissolution() {
                            alert("TODO: impl");
                        }
                    } : joined ? {
                        status:"Joined",
                        leave
                    } : over ? {
                        status: "Over"
                    } : {
                        status: "Inputable",
                        join
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