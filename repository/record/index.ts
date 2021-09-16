import { CreateRecordRepository } from "exprocess";
import { getRoomId } from "../../clientData/room"
import { GameCommand, GameResult } from "../../model/store";
import { createFirestoreRecordRepository } from "./impl";

export const createRecordRepository : CreateRecordRepository<GameCommand,GameResult> = (listener) => {
    const roomId = getRoomId();
    return createFirestoreRecordRepository(roomId,listener);
}