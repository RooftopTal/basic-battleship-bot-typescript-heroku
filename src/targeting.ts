import {Matrix} from './matrixClass';
import {Position} from './Position';

export class TargetingMethods{

        public static targetMethodTryRandomBlackSquare(mat:Matrix):Position{
        var column = (Math.floor(Math.random()*10)+1);
        //col is random value between 1 and 10;
        var row;
        if(column%2 == 0){
            row = String.fromCharCode((Math.floor(Math.random()*5)+1)*2+64);
        }
        else{
            row = String.fromCharCode((Math.floor(Math.random()*5))*2+65);

        }
        const nextPos:Position = new Position(row, column);
        //console.log(nextPos.print("trying point"));
        if(mat.validShotPlace(nextPos)) return nextPos;
        else return this.targetMethodTryRandomBlackSquare(mat);
    }

    public static targetMethodPlaceLargestShip(mat):Position{
        return mat.placeLargestShip();
    }

    public static targetMethodOpponentsMostRecentMiss(mat, gameState)
    {
        for(let i = 1; i <= gameState.OpponentsShots.length; i ++){
            if(!gameState.OpponentsShots[gameState.OpponentsShots.length-i].WasHit)
            {
                if(mat.validShotPlace(gameState.OpponentsShots[gameState.OpponentsShots.length-i].Position)){
                    return gameState.OpponentsShots[gameState.OpponentsShots.length-i].Position;

                }
            }
        }
        return this.targetMethodTryRandomBlackSquare(mat);
    }
}