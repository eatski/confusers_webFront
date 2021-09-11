import { getRoomId } from "../../clientData/room"
import { createFirestoreRecordRepository } from "./impl";

export const getRecordRepository = () => {
    const roomId = getRoomId();
    return createFirestoreRecordRepository(roomId);
}