import React from "react";
import { CardModel, Player } from "../../model/types";
import { Card } from "../Card";
import styles from "./style.module.scss"

export type PlayerPanelProps = {
    you: boolean,
    player: Player,
    cards: CardModel[]
}

export const PlayerPanel: React.FC<PlayerPanelProps> = ({player,cards}) => {
    return <div className={styles.container} data-player={player.code}>
        <dl className={styles.container}>
            <dt><span>{player.displayName}</span></dt>
            <dd>
                {cards.map(({type,number,id}) => <Card key={id} id={id} type={type} number={number}/>)}
            </dd>
        </dl>
    </div>
}

