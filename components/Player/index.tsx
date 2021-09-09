import React from "react";
import { Player } from "../../model/types";
import { CardView, CardViewProps } from "../Card";
import styles from "./style.module.scss"

export type PlayerPanelProps = {
    you: boolean,
    player: Player,
    cards: CardViewProps[]
}

export const PlayerPanel: React.FC<PlayerPanelProps> = ({player,cards}) => {
    return <div className={styles.container} data-player={player.code}>
        <dl className={styles.container}>
            <dt><span>{player.displayName}</span></dt>
            <dd>
                {cards.map((props) => 
                    <div className={styles.cardContainer} data-selected={props.selected} key={props.id}><CardView  {...props}/></div>)}
            </dd>
        </dl>
    </div>
}

