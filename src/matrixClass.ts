import {Position} from './Position'

export class Matrix{
    public board:number[][] = [];
    /*
    0 = uncharted
    1 = hit
    2 = miss

    */


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
            console.log(this.getRowPos(pos.Row));
            if(gameState.MyShots[i].WasHit){
                this.board[this.getRowPos(pos.Row)][pos.Column] = 1;
            }
            else{
                this.board[this.getRowPos(pos.Row)][pos.Column] = 2;
            }

        }
    }

    private getRowPos(row:string){
        return row.charCodeAt(0)-65;
    }

    public isHitAt(pos){
        return this.board[this.getRowPos(pos.Row)][pos.Column] == 1;
    }

    public isMissAt(pos){
        return this.board[this.getRowPos(pos.Row)][pos.Column] == 2;
    }

}