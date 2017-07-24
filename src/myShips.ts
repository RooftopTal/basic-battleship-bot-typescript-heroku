import {Position} from './Position';

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
}