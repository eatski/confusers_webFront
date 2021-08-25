import { Meeting } from "../../components/Meeting";
import { useMeeting } from "./hooks"

export const MeetingContainer : React.FC = () => {
    const state = useMeeting();
    return <Meeting {...state}></Meeting>
}