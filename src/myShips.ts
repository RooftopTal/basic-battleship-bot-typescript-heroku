import {Position} from './Position';
import {ShipPlacement} from './shipPlacement';

export class MyShips{
    public board:number[][] = [];
     
    public constructor(myShips){
        for(let i = 0; i<10;i++){
            const col = new Array;
            for(let j =0; j < 10; j++){
                col[j] = 0;
            }
            this.board[i] = col;
        }

        for(let i = 0; i<myShips.length; i ++)
        {
            if(myShips[i].StartingSquare.Row ==myShips[i].EndingSquare.Row){
                //horizontal ship
                this.addVerticalShip(myShips[i].StartingSquare,myShips[i].EndingSquare);
            }
            else{
                //vertical ship
                this.addVerticalShip(myShips[i].StartingSquare,myShips[i].EndingSquare);
            }
        }
    }


    private CreatePositionFromInput(pos){
        return new Position(pos.Row, pos.Column);
    }

    public addVerticalShip(from, to){
        let firstCoords = this.coordsFromPosition(from);
        let otherCoords = this.coordsFromPosition(to);
        for(let i = firstCoords[0]; i <= otherCoords[0]; i ++){
            this.board[i][firstCoords[1]] = 1;
        }
    }
    
    public addHorizontalShip(from, to){
        let firstCoords = this.coordsFromPosition(from);
        let otherCoords = this.coordsFromPosition(to);
        for(let i = firstCoords[1]; i <= otherCoords[1]; i ++){
            this.board[firstCoords[0]][i] = 1;
        }
    }

    private positionFromCoords(row, col){
        return new Position(String.fromCharCode(row+65), col+1);
    }
    
    private coordsFromPosition(pos){
        return [pos.Row.charCodeAt(0)-65, pos.Column-1];
    }

    public wasHit(shot):boolean{
        const pos = this.coordsFromPosition(shot);
        return this.board[pos[0]][pos[1]] == 1;
    }

    public createBoard(){
        let returnList: ShipPlacement;
        let shipLength:number[] = [5,4,3,3,2];
        for(let i = 0; i<shipLength.length; i ++){
            let horizontal = Math.random()> 0.5;
            const linePref = Math.floor(Math.random()*10);
            for(let a = 0; a < 2; a ++){
                horizontal = !horizontal;
                for(let b = 0; b<10; b ++){
                    let line = (linePref+b)%10;
                    for(let startPos = 0; startPos < this.board.length-shipLength[i]; startPos ++){
                        let possible = true;
                        for(let i = 0; i < shipLength[i]; i ++){
                            if(!horizontal && !(this.board[startPos+i][line] == 0) || horizontal && !(this.board[line][startPos+i]==0)){
                                if(!horizontal)console.log(this.board[startPos+i][line]);
                                else console.log(this.board[line][startPos+i]);
                                possible = false;
                                break;
                            }
                        }
                        if(possible)
                        {
                            if(horizontal){
                                returnList[i] = new ShipPlacement(this.positionFromCoords(startPos, line),this.positionFromCoords(startPos+shipLength[i], line))
                                this.createHorizontalShip(this.positionFromCoords(line,startPos),shipLength[i])
                                this.surroundHorizontalShips();
                            }
                            else{
                                returnList[i] = new ShipPlacement(this.positionFromCoords(line, startPos),this.positionFromCoords(line, startPos+shipLength[i]))
                                this.createVerticalShip(this.positionFromCoords(line, startPos),shipLength[i])
                                this.surroundVerticalShips();
                            }
                        }
                    }
                }
            }
        }
        return returnList;
    }

    private createHorizontalShip(pos, len)
    {
        const coords = this.coordsFromPosition(pos);
        for(let i = 0; i < len; i ++){
            this.board[coords[0]][coords[1]+i];
        }
    }

    private createVerticalShip(pos, len)
    {
        const coords = this.coordsFromPosition(pos);
        for(let i = 0; i < len; i ++){
            this.board[coords[0]+i][coords[1]];
        }
    }

    private surroundHorizontalShips(){
        let hitCount;
        for(let row =0; row < this.board.length; row ++){
            hitCount = 0;
            for(let col = 0; col < this.board.length; col ++){
                if(this.board[row][col] == 1)hitCount ++;
                else if(this.board[row][col] != 1){
                    if(hitCount > 1)this.horizontalSurroundShip(row,col,hitCount);
                    
                    hitCount = 0 ;
                }
            }
        }
    }

    private surroundVerticalShips(){
        let hitCount;
        for(let col =0; col < this.board.length; col ++){
            hitCount = 0;
            for(let row = 0; row < this.board.length; row ++){
                if(this.board[row][col] == 1)hitCount ++;
                else if(this.board[row][col]!= 1){
                    if(hitCount > 1)this.verticalSurroundShip(row,col,hitCount);
                    hitCount = 0 ;
                }
            }
        }
    }

    private horizontalSurroundShip(row:number, col:number, length)
    {
        for(let i =0; i <= length+1; i ++ ){
            if(col-i >= 0 && col-i<=9){
                if(row-1>= 0)this.board[row-1][col-i] =4;
                this.board[row][col-i] =4;
                if(row+1<10)this.board[row+1][col-i] =4;
            }
        }
    }

    private verticalSurroundShip(row:number, col:number, length)
    {
        for(let i =0; i <= length+1; i ++ ){
            if(row-i>=0 && row-i<=9){
                if(col-1>=0)this.board[row-i][col-1] =4;
                this.board[row-i][col] =4;
                if(col+1<10)this.board[row-i][col+1] =4;
            }
        }
    }
}