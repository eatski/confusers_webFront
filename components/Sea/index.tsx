
import React from "react"
import { Cell } from "../Cell"
import styles from "./style.module.scss"

export type SeaProps = {
    select?: () =>void
}
export const Sea : React.FC<SeaProps> = ({select}) => {
    return <Cell>
        <div className={styles.container} onClick={select}>
            <div className={styles.content}></div>
        </div>
    </Cell>
}