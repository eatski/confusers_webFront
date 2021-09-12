export type Token = {
    x: number,
    y: number,
    code: number
}

export type Card = {
    id: string,
    body: CardBody
}

export type Curved = "Curved";
export type Straight = "Straight";
export type AnywhereBuild = "AnywhereBuild";

export type CardBody =
    MoveCardBody |
    {
        type: AnywhereBuild
    }

export type MoveCardBody =
    {
        type: Curved,
        number: [number, number]
    } |
    {
        type: Straight,
        number: number
    }


export type CardUse =
    MoveCardUse |
    {
        type: AnywhereBuild,
        address: Address
    }

export type MoveCardUse =
    {
        type: Curved,
        direction: [Direction, Direction]
    } |
    {
        type: Straight,
        direction: Direction
    }

export const CARDS: CardBody[] = [
    { type: "Straight", number: 2 },
    { type: "Straight", number: 3 },
    { type: "Straight", number: 4 },
    { type: "Curved", number: [1, 1] },
    { type: "Curved", number: [1, 2] },
    { type: "Curved", number: [1, 3] },
    { type: "Curved", number: [2, 1] },
    { type: "Curved", number: [2, 2] },
    { type: "Curved", number: [3, 1] },
    { type: "AnywhereBuild" }
]

export type Address = { x: number, y: number }

export const DIRECTIONS = ["X+", "X-", "Y+", "Y-"] as const
export type Direction = typeof DIRECTIONS[number]

export class PlayersList {
    constructor(private inner: MeetingPlayer[]) { }
    getAll() {
        return this.inner;
    }
    isHost() {
        return !!this.inner.find(e => e.you && e.host)
    }
    isJoined() {
        return !!this.inner.find(e => e.you)
    }
    isOver() {
        return this.inner.length >= PLAYERS_NUM;
    }

}

export type MeetingPlayer = {
    id: string,
    displayName: string,
    you: boolean,
    registeredAt: number,
    host: boolean
}

export const PLAYERS_NUM = 4;

export type Map = Cell[]

export type Cell = {
    x: number,
    y: number,
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
