
import React from "react"
import { Token } from "../../model/types"
import { FloatingCell } from "../Cell"
import styles from "./style.module.scss"

export type MapProps = Token

export const Man : React.FC<MapProps> = (props) => {
    return <TokenInner {...props}></TokenInner>
}

export type DestinationProps = {
    select: () => void,
    id: string,
} & Token

export const TokenVirtual : React.FC<DestinationProps> = (props) => {
    return <TokenInner {...props}></TokenInner>
}

const TokenInner : React.FC<MapProps & {select?:() => void}> = (props) => {
    return <FloatingCell x={props.x} y={props.y}>
        <div className={styles.container} onClick={props.select} data-clickable={props.select && true} data-player={props.code}>
            <div className={styles.content}></div>
        </div>
    </FloatingCell>
}