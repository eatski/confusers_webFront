
import React from "react"
import { Cell } from "../Cell"
import styles from "./style.module.scss"
export const Sea : React.FC = () => {
    return <Cell>
        <div className={styles.container}>
            <div className={styles.content}></div>
        </div>
    </Cell>
}