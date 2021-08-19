
import React from "react"
import { FloatingCell,FloatingCellProps } from "../Cell"
import styles from "./style.module.scss"

export type MapProps = {
    player: number
} & FloatingCellProps

export const Man : React.FC<MapProps> = (props) => {
    return <FloatingCell {...props}>
        <div className={styles.container} data-player={props.player}>
            <div className={styles.content}></div>
        </div>
    </FloatingCell>
}