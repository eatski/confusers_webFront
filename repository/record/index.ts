import { getRoomId } from "../../clientData/room"
import { RecordRepositoryImpl } from "./impl";

export const getRecordRepository = () => {
    const roomId = getRoomId();
    return new RecordRepositoryImpl(roomId);
}