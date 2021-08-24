import React from "react";
import { MapData } from "../../model/mapData";
import { PlayerModel } from "../../model/player";
import { Board } from "../Board";
import { Man } from "../Man";
import { Player } from "../Player";
import styles from "./style.module.scss"

export type GamePlayProps = {
    players: PlayerModel[],
    map: MapData
}

export const GamePlay : React.FC<GamePlayProps> = ({players,map}) => {
    return <main className={styles.container}>
    <div>
        <Player 
          meta={{displayName:"hoge",code:0,you:false}} 
          cards={[
            {id: "1",type:"Curved",number:3},
            {id: "2",type:"Hidden",number:2},
            {id: "3",type:"Straight",number:7}
          ]} 
        />
        <Player 
          meta={{displayName:"fuga",code:1,you:false}} 
          cards={[
            {id: "1",type:"Curved",number:3},
            {id: "2",type:"Straight",number:2},
            {id: "3",type:"Straight",number:7}
          ]} 
        />
      </div>
      <div className={styles.center}>
        <Board mapData={map}></Board>
        <div>
            {players.map(p => <Man key={p.id} x={p.x} y={p.y} player={p.id}></Man>)}
        </div>
      </div>
      <div>
        <Player 
          meta={{displayName:"fuga",code:2,you:false}} 
          cards={[
            {id: "1",type:"Curved",number:3},
            {id: "2",type:"Straight",number:2},
            {id: "3",type:"Straight",number:7}
          ]} 
        />
        <Player
          meta={{displayName:"hoge",code:3,you:false}} 
          cards={[
            {id: "1",type:"Curved",number:3},
            {id: "2",type:"Straight",number:2},
            {id: "3",type:"Straight",number:7}
          ]} 
        />
      </div>
    </main>
}
