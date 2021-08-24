import React from "react";
import { useLanding } from "./hooks";

export const LandingContainer : React.FC = () => {
    const room = useLanding();
    return <button style={{"border":"solid 1px blue"}} onClick={room.createRoom}>Create Room</button>
}
