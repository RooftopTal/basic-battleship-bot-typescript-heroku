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

    private walkingPositive(firstPos:Position, secondPos:Position){
        return firstPos.Row > secondPos.Row || firstPos.Column < secondPos.Column;
        
    }

    public selectTarget(gameState) {
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


    private shotOnBoard(pos:Position){
        return (pos.Row.charAt(0)>= 'A' && pos.Row.charAt(0) <= 'J' && pos.Column>=1 && pos.Column <= 10);
    }


    private hitButUnknownDirection(mat:Matrix, hitPosition:Position):Position{
        hitPosition.print("orig ");
        var nextShot =new Position(this.getUpRow(hitPosition.Row), hitPosition.Column);
        nextShot.print("pos1 ");
        if(mat.alreadyMissAt(nextShot) || mat.alreadyHitAt(nextShot) || hitPosition.Row == 'A'){
            nextShot = new Position(hitPosition.Row, this.getRightColumn(hitPosition.Column));
            nextShot.print("pos2 ");

            if(mat.alreadyMissAt(nextShot) || mat.alreadyHitAt(nextShot)|| hitPosition.Column == 10){
                nextShot =new Position(this.getDownRow(hitPosition.Row), hitPosition.Column);
                nextShot.print("pos3 ");
                if(mat.alreadyMissAt(nextShot) || mat.alreadyHitAt(nextShot) || hitPosition.Row == 'J'){
                    nextShot = new Position(hitPosition.Row, this.getLeftColumn(hitPosition.Column));
                }
            }
        }
        return nextShot;
    }


    private shipHorizontal(shot1:Position, shot2:Position){
        if(shot1.Row == shot2.Row){
            return true;
        }
        return false;
    }

    private getNextTarget(mat:Matrix):Position {
        mat.surroundHorizontalShips();
        mat.surroundVerticalShips();
        return this.targetMethodTryRandomBlackSquare(mat);
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

    private getDownRow(row) {
        var newRow = row.charCodeAt(0) + 1;
        if(newRow > 'J'.charCodeAt(0)) {
            return 'A';
        }
        return String.fromCharCode(newRow);
    }

    private getUpRow(row) {
        var newRow = row.charCodeAt(0) - 1;
        if(newRow < 'A'.charCodeAt(0)) {
            return 'J';
        }
        return String.fromCharCode(newRow);
    }

    private getRightColumn(column) {
        return column % 10 + 1;
    }

    private getLeftColumn(column) {
        if(column != 1)return (column+9)%10;
        else return 10;
    }
}

