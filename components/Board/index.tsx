import React from "react";
import { Cell, CellContent } from "../../model/types";
import { Island } from "../Island";
import { Sea } from "../Sea";
import { SymbolCell } from "../Symbol";
import styles from "./style.module.scss"

export type BoardProps = {map: BoardItemProps[]};
export type BoardItemProps = {
    select?:() => void
} & Cell

export type CellContentProps = {
    select: (() => void) | undefined,
} & CellContent

const CellContentView : React.FC<CellContentProps> = (content) => {
    switch (content.type) {
        case "ISLAND":
            return <Island></Island>
        case "SEA":
            return <Sea select={content.select}></Sea>
        case "SYMBOL":
            return <SymbolCell symbol={content.symbol}></SymbolCell>
    }
}

export const Board : React.FC<BoardProps>= ({map}:BoardProps) => {
    return <div className={styles.board}>
        {map.map(({x,y,content,select}) => <div 
            key={`${x}-${y}`} 
            style={{gridColumnStart:x,gridColumnEnd:x + 1,gridRowStart: y, gridRowEnd: y + 1}}>
                <CellContentView select={select} {...content}></CellContentView>
        </div>)}
    </div>
}
