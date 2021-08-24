import * as t from "io-ts";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MeetingProps } from "../../components/Meeting";
import { getStore } from "../../infra/firestore";
import { PlayerMeta } from "../../model/player";

const MeetingIO = t.type({
    phase: t.literal("Meeting"),
    players: t.array(t.type({
        code: t.number,
        id: t.string,
        displayName: t.string
    }))
})

export type MeetingState = {
    status: "Fetched",
    props: MeetingProps
} | {
    status: "Loading",
} | {
    status: "Error"
}

export const useMeeting = (): MeetingState => {
    const router = useRouter();
    const [state,setState] = useState<MeetingState>({
        status:"Loading"
    })
    useEffect(() => {
        const roomId = router.query["room"];
        if(!(typeof roomId === "string")){
            setState({
                status:"Error"
            })
            return;
        }
        const store = getStore();
        const yourId = window.localStorage.getItem("yourid");
        const roomRef = store.collection("rooms").doc(roomId);
        roomRef.get().then(room => {
            const io = room.data();
            const decoded = MeetingIO.decode(io);
            setState(() => {
                if(decoded._tag === "Right"){
                    const data = decoded.right;
                    const you = typeof yourId === "string" ? data.players.find(p => p.id === yourId)?.code : null
                    if(you === undefined){
                        return {
                            status:"Error"
                        }
                    }
                    const players : PlayerMeta[]= data.players.map(player => ({
                        code:player.code,
                        displayName: player.displayName,
                        you: player.id === yourId
                    }))
                    if(you === null){
                        return {
                            status: "Fetched",
                            props:{
                                players,
                                joined:false,
                                onJoin(name) {
                                    console.log(name)
                                }
                            }
                        }
                    } 
                    return {
                        status: "Fetched",
                        props:{
                            players,
                            joined:true
                        }
                    }
                }
                return {
                    status:"Error"
                }
            })
        })
    },[router.query])
    
    return state
}