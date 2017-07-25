import { ShipPlace } from './shipPlace';
import { Shot } from './shot';

export interface Gamestate {
    GameCount: number,
    ShipPositions: ShipPlace[],
    MyShots: Shot[],
    OpponentsShots: Shot[]
}