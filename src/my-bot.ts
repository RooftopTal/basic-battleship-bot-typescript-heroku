import {Position} from './Position'
import {Matrix} from './matrixClass'
import {TargetingMethods} from './targeting'

export class MyBot {
    private state;
    public getShipPositions() {
        return [
            { StartingSquare: { Row: "J", Column: 1 }, EndingSquare : { Row: "J", Column: 5 } },
            { StartingSquare: { Row: "C", Column: 3 }, EndingSquare : { Row: "F", Column: 3 } },
            { StartingSquare: { Row: "A", Column: 1 }, EndingSquare : { Row: "C", Column: 1 } },
            { StartingSquare: { Row: "H", Column: 1 }, EndingSquare : { Row: "H", Column: 3 } },
            { StartingSquare: { Row: "J", Column: 9 }, EndingSquare : { Row: "J", Column: 10 } },
        ]
    }

    public selectTarget(gameState) {
        try{
            console.log("turn "+ (gameState.MyShots.length+1))
            var mat:Matrix = new Matrix(gameState);
            var ispreviousShot = gameState.MyShots && gameState.MyShots[gameState.MyShots.length-1];
            if(ispreviousShot) {
                var previousShot = gameState.MyShots[gameState.MyShots.length-1];
                var previousShotAsCorrectClass = new Position(previousShot.Position.Row, previousShot.Position.Column);
                if(previousShot.WasHit)
                {
                    if(!mat.isThereUnsunkShipAt(previousShotAsCorrectClass)) return this.getNextTarget(mat, gameState);
                    else {
                        // console.log(mat.board);
                        return mat.returnUnsunkShot();
                    }
                }
                else{
                    for(let i = 1; i <= gameState.MyShots.length; i ++){
                        if(gameState.MyShots[gameState.MyShots.length-i].WasHit){
                            //this is the most recent hit;
                            if(!mat.isThereUnsunkShipAt(new Position(gameState.MyShots[gameState.MyShots.length-i].Position.Row, gameState.MyShots[gameState.MyShots.length-i].Position.Column))) return this.getNextTarget(mat, gameState);
                            else{
                                // console.log(mat.board);
                                return mat.returnUnsunkShot();
                            }
                        }
                    }
                }
            }
            return this.getNextTarget(mat, gameState);

        }
        catch(err){
            console.log(err);
        }
    }

    private getNextTarget(mat:Matrix, gameState):Position {
        mat.surroundHorizontalShips();
        mat.surroundVerticalShips();
        console.log(mat.board);
        console.log(mat.ships);
        if(gameState.MyShots.length< 20)return TargetingMethods.targetMethodOpponentsMostRecentMiss(mat, gameState);
        else if(mat.ships[4] || mat.ships[5])return TargetingMethods.targetMethodPlaceLargestShip(mat);
        else return TargetingMethods.targetMethodTryRandomBlackSquare(mat);
    }
}

