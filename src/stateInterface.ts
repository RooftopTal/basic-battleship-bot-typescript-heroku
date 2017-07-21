import {Position} from './Position'
export interface StateInterface{
    nextMove(gameState):Position;
}