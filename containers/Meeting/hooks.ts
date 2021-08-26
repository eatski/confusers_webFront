import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MeetingProps } from "../../components/Meeting";
import { getMeetingPlayerRepository } from "../../repository/meetingPlayer";
import { getRoomId } from "../../clientData/room";
import { PLAYERS_NUM } from "../../model/player";
import { getRoomRepository } from "../../repository/room";

export const useMeeting = (): MeetingProps => {

    const [state,setState] = useState<MeetingProps>({
        status:"Fetching"
    })
    const router = useRouter();
    useEffect(() => {
        const roomRepo = getRoomRepository();
        return roomRepo.syncRoomPhase((phase) => {
            switch (phase) {
                case "GamePlay":
                    router.push(`/gameplay?room=${getRoomId()}`)
                    return;
                default:
                    break;
            }
        },() => {
            setState({
                status: "Error"
            })
        })
    },[router])
    useEffect(() => {
        const meetingPlayerDao = getMeetingPlayerRepository();
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
                setState({
                    status: "Fetched",
                    players:players.getAll(),
                    form: players.isHost() ? {
                        status: "Joined_As_Host",
                        start(){
                            const roomRepo = getRoomRepository();
                            roomRepo.startGame();
                        },
                        dissolution() {
                            alert("TODO: impl");
                        }
                    } : players.isJoined() ? {
                        status:"Joined",
                        leave
                    } : players.isOver() ? {
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