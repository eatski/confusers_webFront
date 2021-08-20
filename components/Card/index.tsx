import React from "react";
import { CardModel, CardType } from "../../model/card";
import styles from "./style.module.scss"

export const Card: React.FC<CardModel> = ({type,number}) => {
    const Arrow = typeToComponent[type];
    return <div className={styles.container}>
        <Arrow></Arrow>
        <div>{number}</div>
    </div>
}


const ArrowCurved = () => 
    <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M16 10H40V18H22V18C18.6863 18 16 15.3137 16 12V10Z" />
        <path d="M0 2H12H18C21.3137 2 24 4.68629 24 8V10H0V2Z"/>
        <path d="M40 6L48 14L40 22V6Z"/>
    </svg>

const ArrowStraight = () => 
    <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M0 8H40V16H0V8Z" />
        <path d="M40 4L48 12L40 20V4Z" />
    </svg>

const typeToComponent : Record<CardType,() => JSX.Element> = {
    "Curved": ArrowCurved,
    "Straight": ArrowStraight
}
