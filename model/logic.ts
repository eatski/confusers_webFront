import { Address, CardBody, CardUse, Cell, Direction, DIRECTIONS, SYMBOLS, SymbolType, Token } from "./types";

const rnd = (num: number) => Math.floor(Math.random() * num);
const pickRnd = <T>(array: T[]): [T, T[]] => {
    const pickedIndex = rnd(array.length);
    const picked = array[pickedIndex];
    if (!picked) {
        throw new Error("Never")
    }
    const newArray = array.filter((_, i) => i !== pickedIndex);
    return [picked, newArray]
}

export const STARTING_ISLANDS: Address[] = [{ x: 6, y: 6 }, { x: 7, y: 6 }, { x: 6, y: 7 }, { x: 7, y: 7 }];
const allowedProximityNum = 4;
export const createMap = (): Cell[] => {
    const MAP_SIZE = [...Array(14)].map((_, i) => i);
    const addresses: Address[] = MAP_SIZE.reduce<Address[]>((acc, x) => MAP_SIZE.reduce<Address[]>((acc, y) => [...acc, { x, y }], acc), [])

    const isAllowedProximity = (a: Address, b: Address): boolean => {
        return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y)) > allowedProximityNum
    }
    //FIXME: Shuffle??
    const [_, symbols] = SYMBOLS.reduce<[Address[], [SymbolType, Address][]]>(([addresses, acc], cur) => {
        const [picked, left] = pickRnd(addresses);
        const removed = left.filter(
            e => isAllowedProximity(e, picked)
        )
        return [removed, [...acc, [cur, picked]]]
    }, [
        addresses.filter((address) => !STARTING_ISLANDS.some(start => !isAllowedProximity(address, start))),
        []
    ]);

    return addresses.map<Cell>(({ x, y }) => {
        if (STARTING_ISLANDS.some(e => e.x === x && e.y === y)) {
            return {
                x,
                y,
                content: {
                    type: "ISLAND"
                }
            }
        }
        const symbolResult = symbols.find(([_, e]) => e.x === x && e.y === y);
        if (symbolResult) {
            const [symbol] = symbolResult;
            return {
                x,
                y,
                content: {
                    type: "SYMBOL",
                    symbol
                }
            }
        }
        return {
            x,
            y,
            content: {
                type: "SEA"
            }
        }
    })
}

export const createCards: () => CardBody[] = () => {
    const MAP_SIZE = [...Array(allowedProximityNum)].map((_, i) => i + 1);
    const straight: CardBody[] = MAP_SIZE.filter(i => i !== 1).map(number => ({
        type: "Straight",
        number
    }));
    const curved: CardBody[] =
        MAP_SIZE.reduce<CardBody[]>(
            (acc, num1) => MAP_SIZE.reduce<CardBody[]>((acc, num2) => num1 + num2 > allowedProximityNum ? acc : [...acc, { type: "Curved", number: [num1, num2] }], acc), [])

    return [...straight, ...curved]
}

export const pickCard = (): CardBody => {
    const cards = createCards();
    const [card] = pickRnd(cards);
    return card;
}

const toCellsMap = (cells: Cell[]): CellsMap => {
    const generateKey = (cell: Address) => `${cell.x}-${cell.y}`;
    const map = new Map<string, Cell>(cells.map<[string, Cell]>((cell) => [generateKey(cell), cell]))
    return {
        get(address) {
            return map.get(generateKey(address)) || null
        }
    }
}

type CellsMap = {
    get: (address: Address) => Cell | null
}
type MoveChunk = {
    direction: Direction,
    number: number
}

const simpleMove = (current: Address, direction: Direction): Address => {
    const dirToXY: Record<Direction, Address> = {
        "X+": { x: 1, y: 0 },
        "X-": { x: -1, y: 0 },
        "Y+": { x: 0, y: 1 },
        "Y-": { x: 0, y: -1 }
    }
    const xy = dirToXY[direction];
    return {
        x: current.x + xy.x,
        y: current.y + xy.y,
    }
}
const move = (current: Address, chunks: MoveChunk[], cells: CellsMap,tokens: Token[]): Address | null => {
    
    const fn = (cur: Address, chunkNumber: number, number: number): Address | null => {
        const cell = cells.get(cur);
        if (!cell) {
            return null
        }
        const chunk = chunks[chunkNumber];
        if (!chunk) {
            const stop = 
                (cell.content.type === "ISLAND" || cell.content.type === "SYMBOL") 
                && !tokens.find(token => token.x === cell.x && token.y === cell.y)
            return stop ? cur : null
        }

        const passable = cell.content.type === "SEA"
        if (!passable && (chunkNumber !== 0 || number !== 0)) {
            return null
        }
        const next = simpleMove(cur, chunk.direction);
        return chunk.number === number + 1 ?
            fn(next, chunkNumber + 1, 0) :
            fn(next, chunkNumber, number + 1)
    }
    return fn(current, 0, 0);
}

type AvailableDestinations = { use: CardUse, next: Address }
export const getAvailableDestinations = (card: CardBody, cells: Cell[], cur: Address,tokens:Token[]): AvailableDestinations[] => {
    const map = toCellsMap(cells);
    const opposeDirection: Record<Direction, Direction> = {
        "X+": "X-",
        "X-": "X+",
        "Y+": "Y-",
        "Y-": "Y+"
    }

    switch (card.type) {
        case "Straight":
            return DIRECTIONS.reduce<AvailableDestinations[]>((acc, dir) => {
                const chunks: MoveChunk[] = [
                    { direction: dir,number: card.number}
                ]
                const res = move(cur, chunks, map ,tokens);
                if (res) {
                    const use: CardUse = {
                        type: "Straight",
                        direction: dir
                    }
                    return [...acc, {
                        use, next: res
                    }]
                }
                return acc
            }, [])
        case "Curved":
            return DIRECTIONS.reduce<AvailableDestinations[]>(
                (acc, dir1) => {
                    return DIRECTIONS
                        .filter(dir2 => dir1 !== dir2 && dir1 !== opposeDirection[dir2])
                        .reduce<AvailableDestinations[]>((acc, dir2) => {
                            const chunks: MoveChunk[] = [
                                { direction: dir1,number: card.number[0]},
                                { direction: dir2,number: card.number[1]}
                            ]
                            const res2 = move(cur, chunks, map,tokens);
                            if (res2) {
                                const use: CardUse = {
                                    type: "Curved",
                                    direction: [dir1, dir2]
                                }
                                return [...acc, {
                                    use, next: res2
                                }]
                            }
                            return acc
                        }, acc)
                }
                , [])
    }
}

export const moveWithCard = (use: CardUse, card: CardBody, cur: Address, cells: Cell[],tokens:Token[]): Address => {
    const map = toCellsMap(cells);
    if (use.type === "Curved" && card.type === "Curved") {
        const chunks: MoveChunk[] = [
            { direction: use.direction[0], number: card.number[0]},
            { direction: use.direction[1], number: card.number[1]}
        ]
        const result = move(cur, chunks, map,tokens);
        if (!result) {
            throw new Error("不正なカード使用です")
        }
        return result;
    }
    if (use.type === "Straight" && card.type === "Straight") {
        const chunks: MoveChunk[] = [
            { direction: use.direction, number: card.number},
        ]
        const result = move(cur, chunks, map,tokens)
        if (!result) {
            throw new Error("不正なカード使用です")
        }
        return result;
    }
    throw new Error("不正なカード使用です")
}


export const canPutIslandChecker = (cells:Cell[],tokens:Token[],yourCode:number) :(address:Address) => boolean => {
    const map = toCellsMap(cells);
    const isSea = (cell:Cell):boolean => {
        return cell.content.type === "SEA"
    }
    const isNotNextToIsland = (cell:Cell) : boolean => {
        return !DIRECTIONS.some(dir => {
            const next = simpleMove(cell,dir);
            const nextCell = map.get(next);
            return nextCell && (nextCell.content.type === "ISLAND" || nextCell.content.type === "SYMBOL")
        })
    }
    const isNearToken = (cell:Cell): boolean => {
        return tokens.some(token => token.code !== yourCode && (Math.abs(token.x - cell.x) + Math.abs(token.y - cell.y)) <= 4)
    }
    const filtered = cells
        .filter(isSea)
        .filter(isNotNextToIsland)
        .filter(isNearToken)
    const filteredMap = toCellsMap(filtered)

    return (address:Address):boolean => {
        return !!filteredMap.get(address)
    }
}

export const exportForTest = {
    toCellsMap
}