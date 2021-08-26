import { getRoomId } from "../../clientData/room"
import { RoomRepository } from "./impl"

export const getRoomRepository = () => {
    return new RoomRepository(getRoomId());
}