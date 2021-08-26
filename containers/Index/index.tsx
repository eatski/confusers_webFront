import React, { useState } from "react";
import { useLanding } from "./hooks";

export const LandingContainer : React.FC = () => {
    const [state,setState] = useState("");
    const room = useLanding();
    return <div>
            <input onChange={e => setState(e.target.value)}></input>
            <button style={{"border":"solid 1px blue"}} onClick={() => room.createRoom(state)}>Create Room</button>
        </div>
}
