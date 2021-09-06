export type Token = {
    x:number,
    y:number,
    code:number
}

export type Card = {
    id: string,
    body: CardBody
}

export type Curved = "Curved";
export type Straight = "Straight";

export type CardBody = {
    type: Curved,
    number: [number,number]
} | {
    type: Straight,
    number: number
}

export type CardUse = {
    type: Curved,
    direction: [Direction,Direction]
} | {
    type: Straight,
    direction: Direction
}

export type Address = {x:number,y:number}


export const DIRECTIONS = ["X+" , "X-" , "Y+" , "Y-"] as const
export type Direction = typeof DIRECTIONS[number]

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
} | {
    type: "SYMBOL",
    symbol: SymbolType
}

export const SYMBOLS = [
    "Quadrupedal",
    "Home",
    "Skull",
    "Tree",
    "Crown",
    "Gem",
    "Book",
    "Liquor",
] as const


export type SymbolType = (typeof SYMBOLS)[number]

export type Player = {
    id: string,
    code: number,
    displayName: string
}
