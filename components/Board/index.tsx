import React from "react";
import { CellContent, Map } from "../../model/types";
import { Island } from "../Island";
import { Sea } from "../Sea";
import { SymbolCell } from "../Symbol";
import styles from "./style.module.scss"

export type BoardProps = {map: Map}

const CellContentView : React.FC<CellContent>= (content) => {
    switch (content.type) {
        case "ISLAND":
            return <Island></Island>
        case "SEA":
            return <Sea></Sea>
        case "SYMBOL":
            return <SymbolCell symbol={content.symbol}></SymbolCell>
    }
}

export const Board = ({map}:BoardProps) => {
    return <div className={styles.board}>
        {map.map(({x,y,content}) => <div 
            key={`${x}-${y}`} 
            style={{gridColumnStart:x,gridColumnEnd:x + 1,gridRowStart: y, gridRowEnd: y + 1}}>
                <CellContentView {...content}></CellContentView>
        </div>)}
    </div>
}
