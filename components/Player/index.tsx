import React from "react";
import { Card, Player } from "../../model/types";
import { CardView } from "../Card";
import styles from "./style.module.scss"

export type PlayerPanelProps = {
    you: boolean,
    player: Player,
    cards: Card[]
}

export const PlayerPanel: React.FC<PlayerPanelProps> = ({player,cards,you}) => {
    return <div className={styles.container} data-player={player.code}>
        <dl className={styles.container}>
            <dt><span>{player.displayName}</span></dt>
            <dd>
                {cards.map((card) => <CardView key={card.id} {...card} hidden={!you} code={player.code}/>)}
            </dd>
        </dl>
    </div>
}

