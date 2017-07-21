import {StateInterface} from './stateInterface';
import {Position} from './Position';
import {BoardFunctions} from './BoardFunction';

export class StateSearching implements StateInterface{
    //TODO make board functions static;
    bf: BoardFunctions =new BoardFunctions();
    public nextMove(gameState):Position
    {
        return this.targetMethodTryRandomBlackSquare(gameState);
    }

        private targetMethodTryRandomBlackSquare(gameState):Position{
        console.log("get next Target method ");
        var column = (Math.floor(Math.random()*10)+1);
        //col is random value between 1 and 10;
        var row;
        if(column%2 == 0){
            row = String.fromCharCode((Math.floor(Math.random()*5)+1)*2+64);
            console.log("even col gives " + row)
        }
        else{
            row = String.fromCharCode((Math.floor(Math.random()*5))*2+65);
            console.log("odd col gives " + row)

        }
        const nextPos:Position = new Position(row, column);
        console.log(nextPos.print("trying point"));
        if(!this.bf.alreadyHitAt(gameState,nextPos) && !this.bf.alreadyMissAt(nextPos)) return nextPos;
        else return this.targetMethodTryRandomBlackSquare(gameState);
    }


}