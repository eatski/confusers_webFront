import React from "react";
import { Player } from "../../model/types";
import { CardView, CardViewProps } from "../Card";
import styles from "./style.module.scss"

export type PlayerPanelProps = {
    you: boolean,
    player: Player,
    cards: CardViewProps[]
}

export const PlayerPanel: React.FC<PlayerPanelProps> = ({player,cards,you}) => {
    return <div className={styles.container} data-player={player.code}>
        <dl className={styles.container}>
            <dt><span>{player.displayName}</span></dt>
            <dd>
                {cards.map((props) => <CardView key={props.id} {...props}/>)}
            </dd>
        </dl>
    </div>
}

