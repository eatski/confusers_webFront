import React from "react";
import { Card } from "../../model/types";
import styles from "./style.module.scss"

export type CardViewProps = Card & {
    code: number,
    hidden: boolean,
    select?: () => void
}

export const CardView: React.FC<CardViewProps> = ({body,code,hidden,select}) => {
    if(hidden){
        return <div className={styles.hidden}>?</div>
    }
    switch (body.type) {
        case "Straight":
            return <div className={styles.container} onClick={select} data-player={code} data-clickable={!!select}>
                <div className={styles.left}>
                    <ArrowStraight></ArrowStraight>
                </div>
                <div className={styles.right}>
                    <div className={styles.straightNumContainer}>{body.number}</div>
                </div>
            </div>
        case "Curved":
            return <div className={styles.container} onClick={select} data-player={code} data-clickable={!!select}>
                <div className={styles.left}>
                    <ArrowCurved></ArrowCurved>
                </div>
                <div className={styles.right}>
                    <div className={styles.curveNumContainerLeft}>{body.number[0]}</div>
                    <div className={styles.curveNumContainerRight}>{body.number[1]}</div>
                </div>
            </div>
    }
    
}

//FIXME: あとで描き直す
const ArrowCurved = () => 
    <svg width="84" height="44" viewBox="0 0 84 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 21H66V33H12C5.37258 33 0 27.6274 0 21Z" fill="#CCCCCC"/>
        <path d="M66 8L84 26L66 44V8Z" fill="#CCCCCC"/>
        <path d="M0 9H14V21H0V9Z" fill="#CCCCCC"/>
    </svg>

//FIXME: あとで描き直す
const ArrowStraight = () => 
    <svg width="84" height="44" viewBox="0 0 84 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 15H66V29H0V15Z" fill="#CCCCCC"/>
        <path d="M66 4L84 22L66 40V4Z" fill="#CCCCCC"/>
    </svg>


