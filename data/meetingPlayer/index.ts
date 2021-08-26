import { getRoomId } from "../room";
import { YourIdDaoImpl } from "../you";
import { MeetingPlayerDAO } from "./impl";

export const getMeetingPlayerDAO = (roomId:string = getRoomId()):MeetingPlayerDAO => {
    const yourIdDao = new YourIdDaoImpl(roomId);
    return new MeetingPlayerDAO(yourIdDao,roomId);
}