import {Position} from './Position'

export class ShipPlacement{
    public StartingSquare:Position;
    public EndingSquare:Position;

    public constructor(start:Position, end:Position){
        this.StartingSquare = start;
        this.EndingSquare = end;
    }
}