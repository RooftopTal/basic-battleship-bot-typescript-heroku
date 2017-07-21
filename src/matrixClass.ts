import {Position} from './Position'

export class Matrix{
    public board:number[][] = [];
    /*
    0 = uncharted
    1 = hit
    2 = miss

    */
    public returnUnsunkShot(){
        for(let row =0; row < this.board.length; row ++){
            for(let col = 0; col < this.board.length; col ++){
                if(this.board[row][col])return this.positionFromCoords(row, col);
            }
        }
        // should never reach hear;
        console.log("never logged");
    }


    public isThereUnsunkShipAt(lastShot:Position):boolean
    {
        // as a side affect add a 3 where the shot should be if true
        lastShot.print("unsunk " );
        var up = lastShot.getPositionAbove();
        var down = lastShot.getPositionDown();
        var left = lastShot.getPositionLeft();
        var right = lastShot.getPositionRight();
        up.print("up " );
        down.print("down " );
        left.print("left " );
        right.print("right " );


        if(left.Column<10 && this.alreadyHitAt(left) || right.Column>1 && this.alreadyHitAt(right)){
            //horizontal ship
            return this.horizontalShipSunk(lastShot);
        }
        else if (this.getRowPos(up.Row) <10  && this.alreadyHitAt(up) || (this.getRowPos(down.Row)>1 && this.alreadyHitAt(down))){
            //vert ship
            return this.verticalShipSunk(lastShot);
        }
        else{
            //ship of size one
            if(this.getRowPos(up.Row) <10 && !this.alreadyMissAt(up))this.board[this.getRowPos(up.Row)][up.Column-1] = 3;
            else if (right.Column>1 && this.alreadyHitAt(right))this.board[this.getRowPos(right.Row)][right.Column-1] = 3;
            else if (this.getRowPos(down.Row)>1 && this.alreadyHitAt(down))this.board[this.getRowPos(down.Row)][down.Column-1] = 3;
            else this.board[this.getRowPos(left.Row)][left.Column-1] = 3;
            return true;
        }
    }

    private verticalShipSunk(lastShot:Position):boolean{
        let count = 0;
        let curPos = lastShot;
        for(let i =1; i<=4; i ++){
            curPos = curPos.getPositionAbove();
            if(this.alreadyMissAt(curPos) || curPos.Column< 1)          break;
            else if(this.alreadyHitAt(curPos))                          count++;
            else{
                this.board[this.getRowPos(lastShot.Row)][lastShot.Column-1] = 3;
                return true;  
            }
        }

        curPos = lastShot;
        for(let i=1; i <= 4-count; i ++){
            curPos = curPos.getPositionDown();
            if(this.alreadyMissAt(curPos) || curPos.Column>10)          break;
            else if(this.alreadyHitAt(curPos))                          count++;
            else{
                this.board[this.getRowPos(lastShot.Row)][lastShot.Column-1] = 3;
                return true;  
            }
        }
        return false;
    }

    private horizontalShipSunk(lastShot:Position):boolean{
        let count = 0;
        let curPos = lastShot;
        for(let i =1; i<=4; i ++){
            curPos = curPos.getPositionLeft();
            if(this.alreadyMissAt(curPos) || curPos.Column< 1)          break;
            else if(this.alreadyHitAt(curPos))                          count++;
            else{
                this.board[this.getRowPos(lastShot.Row)][lastShot.Column-1] = 3;
                return true;  
            }
        }

        curPos = lastShot;
        for(let i=1; i <= 4-count; i ++){
            curPos = curPos.getPositionRight();
            if(this.alreadyMissAt(curPos) || curPos.Column>10)          break;
            else if(this.alreadyHitAt(curPos))                          count++;
            else{
                this.board[this.getRowPos(lastShot.Row)][lastShot.Column-1] = 3;
                return true;  
            }
        }
        return false;
    }
    

    private positionFromCoords(row, col){
        return new Position(String.fromCharCode(row+65), col);
    }

    public constructor(gameState){
        for(let i = 0; i<10;i++){
            const col = new Array;
            for(let j =0; j < 10; j++){
                col[j] = 0;
            }
            this.board[i] = col;
        }
        for(let i = 0; i < gameState.MyShots.length; i++){
            const pos: Position = new Position(gameState.MyShots[i].Position.Row, gameState.MyShots[i].Position.Column);
            if(gameState.MyShots[i].WasHit){
                this.board[this.getRowPos(pos.Row)][pos.Column-1] = 1;
            }
            else{
                this.board[this.getRowPos(pos.Row)][pos.Column-1] = 2;
            }

        }
    }

    private getRowPos(row:string){
        return row.charCodeAt(0)-65;
    }

    public alreadyHitAt(pos){
        return this.board[this.getRowPos(pos.Row)][pos.Column-1] == 1;
    }

    public alreadyMissAt(pos){
        return this.board[this.getRowPos(pos.Row)][pos.Column-1] == 2;
    }

    public validShotPlace(pos:Position){
        var up = pos.getPositionAbove();
        var down = pos.getPositionDown();
        var left = pos.getPositionLeft();
        var right = pos.getPositionRight();
        return !(up.Row != 'J' && this.alreadyHitAt(up)|| left.Column != 10 && this.alreadyHitAt(left) || right.Column != 1 && this.alreadyHitAt(right) || down.Row != 'A' && this.alreadyHitAt(down) ||this.alreadyHitAt(pos) ||this.alreadyMissAt(pos));
    }

}