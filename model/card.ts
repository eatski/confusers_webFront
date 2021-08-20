export type CardType = "Curved" | "Straight" | "Hidden";

export type CardModel = {
    id: string,
    type: CardType,
    number: number
}