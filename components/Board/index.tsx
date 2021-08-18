import React from "react";
import { MapData } from "../../model/mapData";
import { Island } from "../Island";
import { Sea } from "../Sea";
import styles from "./style.module.scss"

export const Board = ({mapData}:{mapData: MapData}) => {
    return <div>
        {mapData.map((row,y) => <div key={y} className={styles.row}>{row.map((cell,x) => cell === "Island" ? <Island key={x}></Island> : <Sea key={x}></Sea>)}</div>)}
    </div>
}
