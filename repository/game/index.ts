import { getRoomId } from "../../clientData/room"
import { GamePlayRepository } from "./impl"

export const getGamePlayRepository = () => {
    return new GamePlayRepository(getRoomId())
}