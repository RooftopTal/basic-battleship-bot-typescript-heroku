import {Position} from './Position'
import {Matrix} from './matrixClass'

export class MyBot {
    private state;
    public getShipPositions() {
        return [
            { StartingSquare: { Row: "J", Column: 1 }, EndingSquare : { Row: "J", Column: 5 } },
            { StartingSquare: { Row: "C", Column: 1 }, EndingSquare : { Row: "C", Column: 4 } },
            { StartingSquare: { Row: "E", Column: 5 }, EndingSquare : { Row: "E", Column: 7 } },
            { StartingSquare: { Row: "H", Column: 1 }, EndingSquare : { Row: "H", Column: 3 } },
            { StartingSquare: { Row: "J", Column: 8 }, EndingSquare : { Row: "J", Column: 9 } },
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
                    if(!mat.isThereUnsunkShipAt(previousShotAsCorrectClass)) return this.getNextTarget(mat);
                    else {
                        // console.log(mat.board);
                        return mat.returnUnsunkShot();
                    }
                }
                else{
                    for(let i = 1; i <= gameState.MyShots.length; i ++){
                        if(gameState.MyShots[gameState.MyShots.length-i].WasHit){
                            //this is the most recent hit;
                            if(!mat.isThereUnsunkShipAt(new Position(gameState.MyShots[gameState.MyShots.length-i].Position.Row, gameState.MyShots[gameState.MyShots.length-i].Position.Column))) return this.getNextTarget(mat);
                            else{
                                // console.log(mat.board);
                                return mat.returnUnsunkShot();
                            }
                        }
                    }
                }
            }
            return this.getNextTarget(mat);

        }
        catch(err){
            console.log(err);
        }
    }

    private getNextTarget(mat:Matrix):Position {
        mat.surroundHorizontalShips();
        mat.surroundVerticalShips();
        console.log(mat.board);
        console.log(mat.ships);
        return this.targetMethodPlaceLargestShip(mat);
    }


    private targetMethodTryRandomBlackSquare(mat:Matrix):Position{
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

    private targetMethodPlaceLargestShip(mat):Position{
        return mat.placeLargestShip();
    }

}

