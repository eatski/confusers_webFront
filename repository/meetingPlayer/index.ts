import { getRoomId } from "../../clientData/room";
import { YourIdClientImpl } from "../../clientData/you";
import { MeetingPlayerRepository } from "./impl";

export const getMeetingPlayerRepository = (roomId:string = getRoomId()):MeetingPlayerRepository => {
    const yourIdDao = new YourIdClientImpl(roomId);
    return new MeetingPlayerRepository(yourIdDao,roomId);
}