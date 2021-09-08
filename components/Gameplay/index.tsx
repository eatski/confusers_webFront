import React from "react";
import { Map } from "../../model/types";
import { Token } from "../../model/types";
import { Board, BoardItemProps } from "../Board";
import { DestinationProps, Man, TokenVirtual } from "../Man";
import { PlayerPanel, PlayerPanelProps } from "../Player";
import styles from "./style.module.scss"

export type GamePlayProps = {
  status: "Playing",
  tokens: Token[],
  map: BoardItemProps[],
  players: PlayerPanelProps[],
  destinations: DestinationProps[] | null
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
            {tokens.map(token => <Man key={token.code} {...token}></Man>)}
          </div>
          {
            props.destinations && <div>{props.destinations.map(des => <TokenVirtual key={des.id} {...des}></TokenVirtual>)}</div> 
          }
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
