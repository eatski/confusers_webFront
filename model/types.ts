export type Token = {
    x:number,
    y:number,
    code:number
}

export type CardType = "Curved" | "Straight" | "Hidden";

export type CardModel = {
    id: string,
    type: CardType,
    number: number
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

export type Map = Cell[]

export type Cell = {
    x:number,
    y:number,
    content: CellContent 
}

export type CellContent = {
    type: "ISLAND"
} | {
    type: "SEA"
} 

export type Player = {
    id: string,
    code: number,
    displayName: string
}
