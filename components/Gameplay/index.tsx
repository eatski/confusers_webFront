import React from "react";
import { Map } from "../../model/types";
import { Token } from "../../model/types";
import { Board } from "../Board";
import { Man } from "../Man";
import { PlayerPanel, PlayerPanelProps } from "../Player";
import styles from "./style.module.scss"

export type GamePlayProps = {
  status: "Playing",
  tokens: Token[],
  map: Map,
  players: PlayerPanelProps[]
} | {
  status: "Loading"
} | {
  status: "Error"
}

export const GamePlay: React.FC<GamePlayProps> = (props) => {
  switch (props.status) {
    case "Playing":
      const {tokens,map,players} = props
      return <main className={styles.container}>
        <div>
          {players[0] && <PlayerPanel {...players[0]} />}
          {players[1] && <PlayerPanel {...players[1]} />}
        </div>
        <div className={styles.center}>
          <Board map={map}></Board>
          <div>
            {tokens.map(p => <Man key={p.code} x={p.x} y={p.y} player={p.code}></Man>)}
          </div>
        </div>
        <div>
          {players[2] && <PlayerPanel {...players[2]} />}
          {players[3] && <PlayerPanel {...players[3]} />}
        </div>
      </main>

    case "Loading":
      return <div>Loading</div>
    case "Error":
      return <div>Error</div>
  }

}
