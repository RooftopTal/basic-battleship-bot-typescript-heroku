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
                console.log("last shot hit")
                if(this.hitArray)this.hitArray[this.hitArray.length] = previousShot.position;
                else this.hitArray = [previousShot.position];
                if(this.stateHitShipButNotSunk)
                {
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
                    this.stateHorizontalShip = this.shipHorizontal(previousShot.position,positionHitBefore);
                    this.stateKnowShipDirection = true;
                    this.stateWalkingPositiveAxis = (onShot == 2 || onShot == 3);
                }

                if(this.stateKnowShipDirection){
                    //walk along ship in correct direction ********
                    if(this.stateHorizontalShip){
                        if(this.stateWalkingPositiveAxis){
                            //next guess to right
                            let nextShot:Position =  new Position(previousShot.position.Row, this.getRightColumn(previousShot.position.Column));
                            if(this.alreadyHitAt(nextShot) || this.alreadyMissAt(nextShot) || nextShot.Column == 1){
                                //clearly to the right is a miss or not on screen so need to find next left guess
                                this.stateWalkingPositiveAxis = false;
                                let noMissLeft = false;
                                for(let i = 2; i <= 4; i ++){
                                    //test position i positions left of current guess
                                    nextShot = new Position(previousShot.position.Row, this.getLeftColumn(nextShot.Column));
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
                            let nextShot:Position =  new Position(previousShot.position.Row, this.getLeftColumn(previousShot.position.column));
                            if(this.alreadyMissAt(nextShot)){
                                //sunk ***********
                            }
                            return nextShot;
                        }
                    }
                    else{
                        //vertical ship
                        if(this.stateWalkingPositiveAxis){
                            //next guess up
                            let nextShot:Position =  new Position(this.getUpRow(previousShot.position.Row), previousShot.position.Column);
                            if(this.alreadyHitAt(nextShot) || this.alreadyMissAt(nextShot) || nextShot.Column == 1){
                                //clearly to the right is a miss or not on screen so need to find next left guess
                                this.stateWalkingPositiveAxis = false;
                                let noMissDown = false;
                                for(let i = 2; i <= 4; i ++){
                                    //test position i positions left of current guess
                                    nextShot =  new Position(this.getDownRow(nextShot.Row), previousShot.position.Column);
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
                            let nextShot:Position =  new Position(this.getDownRow(previousShot.position.Row), previousShot.position.Column);
                            if(this.alreadyMissAt(nextShot)){
                                //sunk ***********
                            }
                            return nextShot;
                        }
                    }
                }
                else{
                    //find the direction by hitting around the hit
                    return this.hitButUnknownDirection(previousShot);
                }
            }
            else
            {
                //not hit
                console.log("last shot missed")

                if(this.missArray)this.missArray[this.missArray.length] = previousShot;
                else this.missArray = [previousShot];

                if(!this.stateHitShipButNotSunk){
                    console.log("not sunk");
                    return this.getNextTarget(gameState, previousShot);
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

            return this.getNextTarget(gameState,previousShot.Position);
        }
        return { Row: "A", Column: 1 };  
    }

    public alreadyHitAt(pos:Position):boolean{
        if(this.hitArray){
            for(let i=0 ; i < this.hitArray.length; i ++){
                if(this.hitArray[i] == pos) return true;
            }
        }
        return false;
    }

    public alreadyMissAt(pos:Position):boolean{
        if(this.missArray){
            for(let i=0 ; i < this.missArray.length; i ++){
                if(this.missArray[i] == pos) return true;
            }
        }
        return false;
    }


    private hitButUnknownDirection(hitPosition:Position):Position{
        var nextShot ={Row:this.getUpRow(hitPosition.Row), Column: hitPosition.Column};
        if(this.alreadyMissAt(nextShot)){
            nextShot = {Row:hitPosition.Row, Column: this.getRightColumn(hitPosition.Column)};
            if(this.alreadyMissAt(nextShot)){
                nextShot ={Row:this.getDownRow(hitPosition.Row), Column: hitPosition.Column};
                if(this.alreadyMissAt(nextShot)){
                    nextShot = {Row:hitPosition.Row, Column: this.getLeftColumn(hitPosition.Column)};
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


    // private lastShotHit(gameState, previousShot){
    //     //note this currently assumes that if two shots hit then they were adjacent so same ship *********
    //     if(gameState.MyShots[gameState.length-2].WasHit){
    //         //hit two in a row
    //         var shotBefore = gameState.MyShots[gameState.length-2];
    //         if(shotBefore.Position.Column == previousShot.Position.Column){
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
        console.log("get next Target method");
        var column = this.getRightColumn(position.Column);
        var row = column === 1 ? this.getDownRow(position.Row) : position.Row;
        var nextPos:Position = new Position(row,column);
        console.log("try "  + nextPos);
        if(!(this.alreadyHitAt(nextPos) || this.alreadyMissAt(nextPos))) return nextPos;
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

