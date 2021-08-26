import React from "react";
import { GamePlay } from "../../components/Gameplay";
import { useGamePlay } from "./hooks";
export const GamePlayContainer = () => {
    const state = useGamePlay();
    return <GamePlay {...state}></GamePlay>
}