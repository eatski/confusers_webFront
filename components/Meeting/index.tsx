import React, { useState } from "react";
import { PlayerMeta } from "../../model/player";
import styles from "./style.module.scss"

export type MeetingProps = {
    joined: true,
    players:PlayerMeta[]
} | {
    joined: false,
    players:PlayerMeta[],
    onJoin: (name:string) => void
}


const Players = ({players}:{players:PlayerMeta[]})  => <ul>
    {players.map(player => <li key={player.code}>{player.displayName}</li>)}
</ul>
export const Meeting: React.FC<MeetingProps> = (props) => {
    const [state,setState] = useState<string>("")
    return <div>
        <Players players={props.players}></Players>
        {props.joined || 
            <div>
                <input onChange={(e) => setState(e.target.value)} value={state}></input>
                <button onClick={() => props.onJoin(state)}>Join</button>
            </div>
        }
        
    </div>
}

