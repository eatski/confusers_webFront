import { getStore } from "../../data/firestore";
import { useRouter } from 'next/router'

export type LandingState = {
    createRoom: () => void
}

export const useLanding = () : LandingState => {
    const router = useRouter();

    return {
        async createRoom() {
            const store = getStore();
            const roomRef = await store.collection("rooms").doc();
            await roomRef.set({
                phase:"Meeting",
                players:[]
            });
            const id = roomRef.id;
            router.push(`/meeting?room=${id}`);
        }
    }
    
}