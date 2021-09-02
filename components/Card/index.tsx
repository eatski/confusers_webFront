import React from "react";
import { Card } from "../../model/types";
import styles from "./style.module.scss"

export type CardViewProps = Card & {
    code: number,
    hidden: boolean
}

export const CardView: React.FC<CardViewProps> = ({body}) => {
    switch (body.type) {
        case "Straight":
            return <div className={styles.container}>
                <div className={styles.left}>
                    <ArrowStraight></ArrowStraight>
                </div>
                <div className={styles.right}>
                    <div className={styles.straightNumContainer}>{body.number}</div>
                </div>
            </div>
        case "Curved":
            return <div className={styles.container}>
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

const ArrowCurved = () => 
    <svg fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 10H28V16H7H6C2.68629 16 0 13.3137 0 10Z" fill="#CCCCCC"/>
        <path d="M28 4L36 12L28 20V4Z" fill="#CCCCCC"/>
        <path d="M8 0H0V10H8V0Z" fill="#CCCCCC"/>
    </svg>



const ArrowStraight = () => 
    <svg fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 6H28V14H0V6Z" fill="#CCCCCC"/>
        <path d="M28 2L36 10L28 18V2Z" fill="#CCCCCC"/>
    </svg>
