export type PlayerModel = {
    x:number,
    y:number,
    id:number
}

export type PlayerMeta = {
    code:number,
    displayName: string,
    you: boolean
}

export type MeetingPlayer = {
    id:string,
    displayName: string,
    you: boolean,
    registeredAt: number
}

export const PLAYERS_NUM = 4;