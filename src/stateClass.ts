   import {Position} from './Position'
   
   export class StateClass{
   
    public stateHitShipButNotSunk = false;
    public stateKnowShipDirection = false;
    public stateHorizontalShip = false;
    public stateWalkingPositiveAxis = false;
    public hitArray:Position[]; 
    public missArray:Position[] = [];

   }