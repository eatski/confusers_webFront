import { Meeting } from "../../components/Meeting";
import { useMeeting } from "./hooks"

export const MeetingContainer : React.FC = () => {
    const state = useMeeting();
    switch (state.status) {
        case "Fetched":
            return <Meeting {...state.props}></Meeting>
        case "Loading": 
            return <div>Loading</div>
        case "Error": 
            return <div>Error</div>
    }
}