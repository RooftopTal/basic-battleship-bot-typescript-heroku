import {Position} from './Position'

export class Matrix{
    public board:number[][] = [];
    /*
    0 = uncharted
    1 = hit
    2 = miss
    3 = suggested target
    4 = blocked out no ship area
    */
    public ships:boolean[] = [true,true,true,true,true];
    /*
    index = length
    0 = 2
    1 = 3
    2 = 3
    3 = 4
    4 = 5
     */


    
    public returnUnsunkShot(){
        for(let row =0; row < this.board.length; row ++){
            for(let col = 0; col < this.board.length; col ++){
                if(this.board[row][col] == 3)return this.positionFromCoords(row, col);
            }
        }
        // should never reach hear;
        console.log("never logged");
    }

    public surroundHorizontalShips(){
        console.log("from " + this.board)
        let hitCount;
        for(let row =0; row < this.board.length; row ++){
            hitCount = 0;
            for(let col = 0; col < this.board.length; col ++){
                if(this.board[row][col] == 1)hitCount ++;
                else if(this.board[row][col] != 1){
                    if(hitCount > 1)this.horizontalSurroundShip(row,col,hitCount);
                }
            }
        }
                console.log("to " + this.board)

    }

        public surroundVerticalShips(){
        let hitCount;
        for(let col =0; col < this.board.length; col ++){
            hitCount = 0;
            for(let row = 0; row < this.board.length; row ++){
                if(this.board[row][col] == 1)hitCount ++;
                else if(this.board[row][col]!= 1){
                    if(hitCount > 1)this.verticalSurroundShip(row,col,hitCount);
                }
            }
        }
    }

    private horizontalSurroundShip(row:number, col:number, length)
    {
        for(let i =0; i <= length+1; i ++ ){
            this.board[row-1][col-i] =4;
            this.board[row][col-i] =4;
            this.board[row+1][col-i] =4;
        }
    }

       private verticalSurroundShip(row:number, col:number, length)
    {
        for(let i =0; i <= length+1; i ++ ){
            this.board[row-i][col-1] =4;
            this.board[row-i][col] =4;
            this.board[row-i][col+1] =4;
        }
    }


    public isThereUnsunkShipAt(lastShot:Position):boolean
    {
        // as a side affect add a 3 where the shot should be if trued
        lastShot.print("unsunk " );
        var up = lastShot.getPositionAbove();
        var down = lastShot.getPositionDown();
        var left = lastShot.getPositionLeft();
        var right = lastShot.getPositionRight();
        if(left.Column<9 && this.alreadyHitAt(left) || right.Column>0 && this.alreadyHitAt(right)){
            //horizontal ship
            console.log("HORIZONTAL ")
            return this.horizontalShipSunk(lastShot);
        }
        else if (this.getRowPos(up.Row) <9  && this.alreadyHitAt(up) || (this.getRowPos(down.Row)>0 && this.alreadyHitAt(down))){
            //vert ship
            console.log("vertical ")
            return this.verticalShipSunk(lastShot);
        }
        else{
            console.log("ship size 1")
            //ship of size one
            if(this.getRowPos(up.Row) <9 && !this.alreadyMissAt(up))this.board[this.getRowPos(up.Row)][up.Column-1] = 3;
            else if (right.Column>0 && !this.alreadyMissAt(right))this.board[this.getRowPos(right.Row)][right.Column-1] = 3;
            else if (this.getRowPos(down.Row)>0 && !this.alreadyMissAt(down))this.board[this.getRowPos(down.Row)][down.Column-1] = 3;
            else this.board[this.getRowPos(left.Row)][left.Column-1] = 3;
            return true;
        }
    }

    private verticalShipSunk(lastShot:Position):boolean{
        let count = 0;
        let curPos = lastShot;
        for(let i =1; i<=5; i ++){
            curPos = curPos.getPositionAbove();
            if(this.alreadyMissAt(curPos) || this.getRowPos(curPos.Row) ==9)          break;
            else if(this.alreadyHitAt(curPos))                          count++;
            else{
                this.board[this.getRowPos(curPos.Row)][curPos.Column-1] = 3;
                return true;  
            }
        }

        curPos = lastShot;
        const startCount = count;
        for(let i=1; i <= 5-startCount; i ++){
            curPos = curPos.getPositionDown();
            if(this.alreadyMissAt(curPos) || this.getRowPos(curPos.Row) ==0)          break;
            else if(this.alreadyHitAt(curPos))                          count++;
            else{
                this.board[this.getRowPos(curPos.Row)][curPos.Column-1] = 3;
                return true;  
            }
        }

        //this indicates in ship array that the ship is sunk
        if(count <= 3){
            this.ships[count-1] = false;
        }
        else if(count = 1){
            this.ships[0] = false;
        }
        else{
            if(this.ships[1])this.ships[1] = false;
            else this.ships[2] = false;
        }

        return false;
    }

    private horizontalShipSunk(lastShot:Position):boolean{
        let count = 0;
        let curPos = lastShot;
        for(let i =1; i<=4; i ++){
            curPos = curPos.getPositionLeft();
            if(this.alreadyMissAt(curPos) || curPos.Column == 10)          break;
            else if(this.alreadyHitAt(curPos))                          count++;
            else{
                this.board[this.getRowPos(curPos.Row)][curPos.Column-1] = 3;
                return true;  
            }
        }

        const startCount = count;

        curPos = lastShot;
        for(let i=1; i <= 4-startCount; i ++){
            curPos = curPos.getPositionRight();
            if(this.alreadyMissAt(curPos) || curPos.Column== 1)          break;
            else if(this.alreadyHitAt(curPos))                          count++;
            else{
                this.board[this.getRowPos(curPos.Row)][curPos.Column-1] = 3;
                return true;  
            }
        }

                //this indicates in ship array that the ship is sunk
        if(count <= 3){
            this.ships[count-1] = false;
        }
        else if(count = 1){
            this.ships[0] = false;
        }
        else{
            if(this.ships[1])this.ships[1] = false;
            else this.ships[2] = false;
        }

        return false;
    }
    

    private positionFromCoords(row, col){
        return new Position(String.fromCharCode(row+65), col+1);
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
        let smallestShip
        if(this.ships[0])       smallestShip = 2; 
        else if(this.ships[2])  smallestShip = 3;
        else if(this.ships[3])  smallestShip = 4;
        else                    smallestShip = 5; 

        return (this.checkVerticalShipFits(smallestShip, pos) || this.checkHorizontalShipFits(smallestShip, pos))
        // var up = pos.getPositionAbove();
        // var down = pos.getPositionDown();
        // var left = pos.getPositionLeft();
        // var right = pos.getPositionRight();
        // return !(up.Row != 'J' && this.alreadyHitAt(up)|| left.Column != 10 && this.alreadyHitAt(left)
        //         || right.Column != 1 && this.alreadyHitAt(right) || down.Row != 'A' && this.alreadyHitAt(down) 
        //         ||this.alreadyHitAt(pos) ||this.alreadyMissAt(pos));
    }

    private checkVerticalShipFits(size, pos):boolean{
        let rowPos = this.getRowPos(pos.Row);
        let colPos = pos.Column-1;

        for(let i = 0; i < size; i ++)
        {
            let row = rowPos-i;
            let possible = true;
            for(let j = 0; j < size; j ++){
                if(row + j> 9 || row +j < 0 || this.board[row+j][colPos] != 0){
                    possible = false;
                    break;
                }
            }
            if(possible) return true;
        }
        return false;
    }

    private checkHorizontalShipFits(size, pos):boolean{
        let rowPos = this.getRowPos(pos.Row);
        let colPos = pos.Column-1;

        for(let i = 0; i < size; i ++)
        {
            let col = colPos-i;
            let possible = true;
            for(let j = 0; j < size; j ++){
                if(col + j> 9 || col + j<0 || this.board[rowPos][col+j] != 0){
                    possible = false;
                    break;
                }
            }
            if(possible) return true;
        }
        return false;
    }

}