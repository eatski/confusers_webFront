import React, { useState } from "react";
import { MeetingPlayer,PLAYERS_NUM } from "../../model/player";
import styles from "./style.module.scss"

export type MeetingProps = {
    status: "Fetched",
    players:MeetingPlayer[]
    form: FormState
} | {
    status: "Fetching",
} | {
    status: "Error"
} 

export type FormState = {
    status: "Inputable",
    join : (name:string) => void,
} | {
    status: "Registering"
} | {
    status: "Over"
} | {
    status: "Joined",
    leave: () => void,
} | {
    status: "Joined_As_Host",
    dissolution: () => void,
    start: () => void
}

const Players = ({players}:{players:MeetingPlayer[]})  => players.length ? <ul>
    {players.map(player => <li key={player.id}>
        <span>{player.displayName}</span>
        {player.you && <span>←You</span>}
    </li>)}
</ul> : <div>No Player</div>

const RegisterForm : React.FC<{onSubmit:(name:string) => void}> = ({onSubmit}) => {
    const [state,setState] = useState("");
    const onClink = () => {
        onSubmit(state)
        setState("");
    }
    return <div>
        <input onChange={(e) => setState(e.target.value)} value={state}></input>
        <button onClick={onClink}>Join</button>
    </div>
}

export const Meeting: React.FC<MeetingProps> = (props:MeetingProps) => {
    switch (props.status) {
        case "Fetching":
            return <div>Loading</div>;
        case "Fetched":
            return <div>
                    <Players players={props.players}></Players>
                    {props.form.status === "Joined" && <button onClick={props.form.leave}>Leave</button>}
                    {props.form.status === "Inputable" && <RegisterForm onSubmit={props.form.join}></RegisterForm>}
                    {props.form.status === "Over" && <div>定員オーバー</div>}
                    {props.form.status === "Registering" && <div>登録中</div>}
                    {props.form.status === "Joined_As_Host" && <button onClick={props.form.start}>Start</button>}
                </div>
        case "Error":
            return <div>Error</div>

    }
}

