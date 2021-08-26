export type ManModel = {
    x:number,
    y:number,
    code:number
}

export type GamePlayer = {
    code:number,
    displayName: string,
    you: boolean
}

export class PlayersList {
    constructor(private inner:MeetingPlayer[]){}
    getAll() {
        return this.inner;
    }
    isHost() {
        return !!this.inner.find(e => e.you && e.host)
    }
    isJoined(){
        return !!this.inner.find(e => e.you)
    }
    isOver() {
        return this.inner.length >= PLAYERS_NUM;
    }

}

export type MeetingPlayer = {
    id:string,
    displayName: string,
    you: boolean,
    registeredAt: number,
    host:boolean
}

export const PLAYERS_NUM = 4;