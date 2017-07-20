import {Position} from './Position'

export class MyBot {

    private stateHitShipButNotSunk = false;
    private stateKnowShipDirection = false;
    private stateHorizontalShip = false;
    private stateWalkingPositiveAxis = false;
    private hitArray:Position[]; 
    private missArray:Position[] = []; 

    public getShipPositions() {
        return [
            { StartingSquare: { Row: "A", Column: 1 }, EndingSquare : { Row: "A", Column: 5 } },
            { StartingSquare: { Row: "C", Column: 1 }, EndingSquare : { Row: "C", Column: 4 } },
            { StartingSquare: { Row: "E", Column: 1 }, EndingSquare : { Row: "E", Column: 3 } },
            { StartingSquare: { Row: "G", Column: 1 }, EndingSquare : { Row: "G", Column: 3 } },
            { StartingSquare: { Row: "I", Column: 1 }, EndingSquare : { Row: "I", Column: 2 } },
        ]
    }

    public selectTarget(gameState) {
        console.log("turn "+ (gameState.MyShots.length+1))
        var ispreviousShot = gameState.MyShots && gameState.MyShots[gameState.MyShots.length-1];
        if(ispreviousShot) {
            var previousShot = gameState.MyShots[gameState.MyShots.length-1];
            if(previousShot.WasHit)
            {
                console.log("last shot hit" + previousShot.Position.Column + previousShot.Position.Row)
                if(this.hitArray)this.hitArray[this.hitArray.length] = new Position(previousShot.Position.Row,previousShot.Position.Column);
                else this.hitArray = [new Position(previousShot.Position.Row,previousShot.Position.Column)];


                if(this.stateHitShipButNotSunk)
                {
                    console.log("already shot at ship")
                    //second hit on ship so can find direction
                    let positionHitBefore;
                    let onShot;
                    for(let i =2; i <= 5; i++){
                        if(gameState.MyShots[gameState.MyShots.length-i].WasHit){
                            positionHitBefore =gameState.MyShots[gameState.MyShots.length-i];
                            onShot = i;
                            break; 
                        }
                    }
                    positionHitBefore.print("last hit at ");
                    this.stateHorizontalShip = this.shipHorizontal(new Position(previousShot.Position.Row, previousShot.Position.Column),positionHitBefore);
                    this.stateKnowShipDirection = true;
                    this.stateWalkingPositiveAxis = (onShot == 2 || onShot == 3);
                }

                if(this.stateKnowShipDirection){
                    console.log("already shot at ship")
                    //walk along ship in correct direction ********
                    if(this.stateHorizontalShip){
                        console.log("horizont ship")
                        if(this.stateWalkingPositiveAxis){
                             console.log("walking positive")

                            //next guess to right
                            let nextShot:Position =  new Position(previousShot.Position.Row, this.getRightColumn(previousShot.Position.Column));
                            if(this.alreadyHitAt(nextShot) || this.alreadyMissAt(nextShot) || nextShot.Column == 1){
                                //clearly to the right is a miss or not on screen so need to find next left guess
                                this.stateWalkingPositiveAxis = false;
                                let noMissLeft = false;
                                for(let i = 2; i <= 4; i ++){
                                    //test position i positions left of current guess
                                    nextShot = new Position(previousShot.Position.Row, this.getLeftColumn(nextShot.Column));
                                    if(this.alreadyMissAt(nextShot)){
                                        // sunk************
                                    }
                                    else if(!this.alreadyHitAt){
                                        //havent shot at this position before
                                        break;
                                    }
                                    else if(i == 4){
                                         noMissLeft = true;
                                    }
                                }
                                if(noMissLeft){
                                    //sunk ****************
                                }
                                else return nextShot;
                            }
                            else{
                                //can just choose position
                                return nextShot;
                            }
                        }
                        else{
                            //next guess to left
                            let nextShot:Position =  new Position(previousShot.Position.Row, this.getLeftColumn(previousShot.Position.column));
                            if(this.alreadyMissAt(nextShot)){
                                //sunk ***********
                            }
                            return nextShot;
                        }
                    }
                    else{
                        console.log("vert ship")
                        //vertical ship
                        if(this.stateWalkingPositiveAxis){
                            //next guess up
                            let nextShot:Position =  new Position(this.getUpRow(previousShot.Position.Row), previousShot.Position.Column);
                            if(this.alreadyHitAt(nextShot) || this.alreadyMissAt(nextShot) || nextShot.Column == 1){
                                //clearly to the right is a miss or not on screen so need to find next left guess
                                this.stateWalkingPositiveAxis = false;
                                let noMissDown = false;
                                for(let i = 2; i <= 4; i ++){
                                    //test position i positions left of current guess
                                    nextShot =  new Position(this.getDownRow(nextShot.Row), previousShot.Position.Column);
                                    if(this.alreadyMissAt(nextShot)){
                                        // sunk************
                                    }
                                    else if(!this.alreadyHitAt){
                                        //havent shot at this position before
                                        break;
                                    }
                                    else if(i == 4){
                                         noMissDown = true;
                                    }
                                }
                                if(noMissDown){
                                    //sunk ****************
                                }
                                else return nextShot;
                            }
                            else{
                                //can just choose position
                                return nextShot;
                            }
                        }
                        else{
                            //next guess down
                            let nextShot:Position =  new Position(this.getDownRow(previousShot.Position.Row), previousShot.Position.Column);
                            if(this.alreadyMissAt(nextShot)){
                                //sunk ***********
                            }
                            return nextShot;
                        }
                    }
                }
                else{
                    //find the direction by hitting around the hit
                    console.log("calling unknownDirectoin")
                    this.stateHitShipButNotSunk = true;
                    return this.hitButUnknownDirection(new Position(previousShot.Position.Row, previousShot.Position.Column));
                }
            }
            else
            {
                //not hit
                console.log("last shot missed")
                if(this.missArray)this.missArray[this.missArray.length] = new Position(previousShot.Position.Row,previousShot.Position.Column);
                else this.missArray = [new Position(previousShot.Position.Row,previousShot.Position.Column)];

                if(!this.stateHitShipButNotSunk){
                    console.log("not sunk");
                    return this.getNextTarget(gameState, new Position(previousShot.Position.Row,previousShot.Position.Column));
                }
                else if(!this.stateKnowShipDirection){
                    let hitPosition;
                    for(let i = 2; i <= 5; i ++){
                        if(gameState.MyShots[gameState.MyShots.length-i].WasHit){
                            hitPosition =gameState.MyShots[gameState.MyShots.length-i];
                            break; 
                        }
                    }
                    return this.hitButUnknownDirection(hitPosition);
                }
                else
                {
                    //end of ship come to *******check other end or sunk
                }
            }

            return this.getNextTarget(gameState,new Position(previousShot.Position.Row,previousShot.Position.Column));
        }
        return { Row: "A", Column: 1 };  
    }

    public alreadyHitAt(pos:Position):boolean{
        if(this.hitArray){
            for(let i=0 ; i < this.hitArray.length; i ++){
                if(this.hitArray[i].Row == pos.Row && this.hitArray[i].Column == pos.Column) return true;
            }
        }
        return false;
    }

    public alreadyMissAt(pos:Position):boolean{
        if(this.missArray){
            for(let i=0 ; i < this.missArray.length; i ++){
                if(this.missArray[i].Row == pos.Row && this.missArray[i].Column == pos.Column) return true;
            }
        }
        return false;
    }


    private hitButUnknownDirection(hitPosition:Position):Position{
        hitPosition.print("orig ");
        var nextShot =new Position(this.getUpRow(hitPosition.Row), hitPosition.Column);
        nextShot.print("pos1 ");
        if(this.alreadyMissAt(nextShot) || this.alreadyHitAt(nextShot) || hitPosition.Row == 'A'){
            nextShot = new Position(hitPosition.Row, this.getRightColumn(hitPosition.Column));
            nextShot.print("pos2 ");

            if(this.alreadyMissAt(nextShot) || this.alreadyHitAt(nextShot)|| hitPosition.Column == 10){
                nextShot =new Position(this.getDownRow(hitPosition.Row), hitPosition.Column);
                nextShot.print("pos3 ");
                if(this.alreadyMissAt(nextShot) || this.alreadyHitAt(nextShot) || hitPosition.Row == 'J'){
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
        console.log("not horizontal = "+ shot1.Row +" = " + shot2.Row)
        return false;
    }


    // private lastShotHit(gameState, previousShot){
    //     //note this currently assumes that if two shots hit then they were adjacent so same ship *********
    //     if(gameState.MyShots[gameState.length-2].WasHit){
    //         //hit two in a row
    //         var shotBefore = gameState.MyShots[gameState.length-2];
    //         if(shotBefore.Position.Column == new Position(previousShot.Position.Row,previousShot.Position.Column).Column){
    //             //shots in the same column so ship is verticle so try next;
    //             if(shotBefore.Row.charCodeAt(0) >= previousShot.Row.charCodeAt(0)+1){
    //                 //shot sequence is going down --assume top of boat is found
    //                 var position = {Row : this.getDownRow(previousShot.Row), Column : shotBefore.position.Column}
    //                 if(!gameState.MyShots.includes(position)) return position;
    //                 else return this.getNextTarget(gameState,previousShot);
    //             }
    //             else{
    //                 var position = {Row : this.getUpRow(previousShot.Row), Column : shotBefore.position.Column}
    //                 if(!gameState.MyShots.includes(position)) return position;
    //                 else {
    //                     position = {Row : this.findBottomOfHits(gameState).Row, Column:shotBefore.position.Column};
    //                     if(!gameState.MyShots.includes(position)) return position;
    //                     else return this.getNextTarget(gameState,previousShot);
    //                 }
    //             }
    //         }
    //         else
    //         {
    //             //shots in horizontal sequence
    //         }
    //     }
    // }

    private findBottomOfHits(gameState):Position
    {
        var bottomPos;
        for(let i = 1; i < gameState.length; i ++){
            if(gameState.MyShots[gameState.length-i].WasHit) bottomPos = gameState.MyShots[gameState.length-i].position;
        }
        return bottomPos;
    }

    private getNextTarget(gameState,position:Position):Position {
        console.log("get next Target method " + position.Column + position.Row );
        var column = this.getRightColumn(position.Column);
        var row:string = column === 1 ? this.getDownRow(position.Row) : position.Row;
        var nextPos:Position = new Position(row,column);
        console.log("try "  + column +" "+ row);
        if(!this.alreadyHitAt(nextPos) && !this.alreadyMissAt(nextPos)) return nextPos;
        else return this.getNextTarget(gameState,nextPos);
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
        return column % 10 - 1;
    }
}

