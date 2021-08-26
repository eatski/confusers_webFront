import React from "react";
import { MapData } from "../../model/mapData";
import { GamePlayer, ManModel } from "../../model/player";
import { Board } from "../Board";
import { Man } from "../Man";
import { Player } from "../Player";
import styles from "./style.module.scss"

export type GamePlayProps = {
  status: "Playing",
  men: ManModel[],
  map: MapData,
  players: {
    meta: GamePlayer,
  }[]
} | {
  status: "Loading"
} | {
  status: "Error"
}

export const GamePlay: React.FC<GamePlayProps> = (props) => {
  switch (props.status) {
    case "Playing":
      const {men,map,players} = props
      return <main className={styles.container}>
        <div>
          {players[0] && <Player
            meta={players[0].meta}
            cards={[
              { id: "1", type: "Curved", number: 3 },
              { id: "2", type: "Hidden", number: 2 },
              { id: "3", type: "Straight", number: 7 }
            ]}
          />}
          {players[1] && <Player
            meta={players[1].meta}
            cards={[
              { id: "1", type: "Curved", number: 3 },
              { id: "2", type: "Hidden", number: 2 },
              { id: "3", type: "Straight", number: 7 }
            ]}
          />}
        </div>
        <div className={styles.center}>
          <Board mapData={map}></Board>
          <div>
            {men.map(p => <Man key={p.code} x={p.x} y={p.y} player={p.code}></Man>)}
          </div>
        </div>
        <div>
          {players[2] && <Player
            meta={players[2].meta}
            cards={[
              { id: "1", type: "Curved", number: 3 },
              { id: "2", type: "Hidden", number: 2 },
              { id: "3", type: "Straight", number: 7 }
            ]}
          />}
          {players[3] && <Player
            meta={players[3].meta}
            cards={[
              { id: "1", type: "Curved", number: 3 },
              { id: "2", type: "Hidden", number: 2 },
              { id: "3", type: "Straight", number: 7 }
            ]}
          />}
        </div>
      </main>

    case "Loading":
      return <div>Loading</div>
    case "Error":
      return <div>Error</div>
  }

}
