import {Position} from './Position'
import {StateClass} from './stateClass'

export class BoardFunctions{
    private state:StateClass;

    public alreadyHitAt(gameState,pos:Position):boolean{
        if(this.state.hitArray){
            for(let i=0 ; i < this.state.hitArray.length; i ++){
                if(this.state.hitArray[i].Row == pos.Row && this.state.hitArray[i].Column == pos.Column) return true;
            }
        }
        return false;
    }

    public alreadyMissAt(pos:Position):boolean{
        if(this.state.missArray){
            for(let i=0 ; i < this.state.missArray.length; i ++){
                if(this.state.missArray[i].Row == pos.Row && this.state.missArray[i].Column == pos.Column) return true;
            }
        }
        return false;
    }

    private shotOnBoard(pos:Position){
        return (pos.Row.charAt(0)>= 'A' && pos.Row.charAt(0) <= 'J' && pos.Column>=1 && pos.Column <= 10);
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
        return (column+9)%10;
    }

        private shipHorizontal(shot1:Position, shot2:Position){
        if(shot1.Row == shot2.Row){
            return true;
        }
        console.log("not horizontal = "+ shot1.Row +" = " + shot2.Row)
        return false;
    }



    private findBottomOfHits(gameState):Position
    {
        var bottomPos;
        for(let i = 1; i < gameState.length; i ++){
            if(gameState.MyShots[gameState.length-i].WasHit) bottomPos = gameState.MyShots[gameState.length-i].position;
        }
        return bottomPos;
    }
}