import React from "react";
import { CardModel } from "../../model/card";
import { GamePlayer } from "../../model/player";
import { Card } from "../Card";
import styles from "./style.module.scss"

export type PlayerProps = {
    meta: GamePlayer,
    cards: CardModel[]
}

export const Player: React.FC<PlayerProps> = ({meta,cards}) => {
    return <div className={styles.container} data-player={meta.code}>
        <dl className={styles.container}>
            <dt><span>{meta.displayName}</span></dt>
            <dd>
                {cards.map(({type,number,id}) => <Card key={id} id={id} type={type} number={number}/>)}
            </dd>
        </dl>
    </div>
}

