import { getRoomId } from "../room";
import { YourIdDaoImpl } from "../you";
import { MeetingPlayerDAO } from "./impl";

export const getMeetingPlayerDAO = ():MeetingPlayerDAO => {
    const roomId = getRoomId();
    if(!roomId){
        throw new Error("No Room Id");
    }
    const yourIdDao = new YourIdDaoImpl(roomId);
    return new MeetingPlayerDAO(yourIdDao,roomId);
}