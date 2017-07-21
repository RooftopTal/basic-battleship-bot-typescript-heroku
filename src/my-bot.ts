import {Position} from './Position'
import {StateClass} from './stateClass'

export class MyBot {
    private state;
    public getShipPositions() {
        return [
            { StartingSquare: { Row: "A", Column: 1 }, EndingSquare : { Row: "A", Column: 5 } },
            { StartingSquare: { Row: "C", Column: 1 }, EndingSquare : { Row: "C", Column: 4 } },
            { StartingSquare: { Row: "E", Column: 1 }, EndingSquare : { Row: "E", Column: 3 } },
            { StartingSquare: { Row: "G", Column: 1 }, EndingSquare : { Row: "G", Column: 3 } },
            { StartingSquare: { Row: "I", Column: 1 }, EndingSquare : { Row: "I", Column: 2 } },
        ]
    }

    private walkingPositive(firstPos:Position, secondPos:Position){
        return firstPos.Row > secondPos.Row || firstPos.Column < secondPos.Column;
    }

    public selectTarget(gameState) {
        console.log("turn "+ (gameState.MyShots.length+1))
        var ispreviousShot = gameState.MyShots && gameState.MyShots[gameState.MyShots.length-1];
        if(ispreviousShot) {
            var previousShot = gameState.MyShots[gameState.MyShots.length-1];
            if(previousShot.WasHit)
            {
                console.log("last shot hit " + previousShot.Position.Column + previousShot.Position.Row)
                if(this.state.hitArray)this.state.hitArray[this.state.hitArray.length] = new Position(previousShot.Position.Row,previousShot.Position.Column);
                else this.state.hitArray = [new Position(previousShot.Position.Row,previousShot.Position.Column)];


                if(this.state.stateHitShipButNotSunk  && !this.state.stateKnowShipDirection)
                {
                    console.log("already shot at ship 1")
                    //second hit on ship so can find direction
                    let positionHitBefore:Position;
                    let onShot;
                    for(let i =2; i <= 5; i++){
                        if(gameState.MyShots[gameState.MyShots.length-i].WasHit){
                            const therePos = gameState.MyShots[gameState.MyShots.length-i].Position;
                            positionHitBefore = new Position(therePos.Row, therePos.Column);
                            onShot = i;
                            break; 
                        }
                    }
                    positionHitBefore.print("last hit at ");
                    this.state.stateHorizontalShip = this.shipHorizontal(new Position(previousShot.Position.Row, previousShot.Position.Column),positionHitBefore);
                    this.state.stateKnowShipDirection = true;
                    this.state.stateWalkingPositiveAxis = this.walkingPositive(positionHitBefore, new Position(previousShot.Position.Row, previousShot.Position.Column));
                }

                if(this.state.stateKnowShipDirection){
                    console.log("already shot at ship")
                    //walk along ship in correct direction ********
                    if(this.state.stateHorizontalShip){
                        console.log("horizont ship")
                        if(this.state.stateWalkingPositiveAxis){
                             console.log("walking positive")

                            //next guess to right
                            let nextShot:Position =  new Position(previousShot.Position.Row, this.getRightColumn(previousShot.Position.Column));
                            if(this.alreadyHitAt(nextShot) || this.alreadyMissAt(nextShot) || nextShot.Column == 1){
                                //clearly to the right is a miss or not on screen so need to find next left guess
                                nextShot =  new Position(previousShot.Position.Row, this.getLeftColumn(previousShot.Position.Column));
                                this.state.stateWalkingPositiveAxis = false;
                                let noMissLeft = false;
                                for(let i = 2; i <= 4; i ++){
                                    //test position i positions left of current guess
                                    nextShot = new Position(previousShot.Position.Row, this.getLeftColumn(nextShot.Column));
                                    if(this.alreadyMissAt(nextShot)){
                                        // sunk************
                                        console.log("SUNK");
                                        this.state.stateHitShipButNotSunk = false;
                                        this.state.stateKnowShipDirection =false;
                                    }
                                    else if(!this.alreadyHitAt(nextShot)){
                                        //havent shot at this position before
                                        break;
                                    }
                                    else if(i == 4){
                                         noMissLeft = true;
                                    }
                                }
                                if(noMissLeft){
                                    //sunk ****************
                                    this.state.stateHitShipButNotSunk = false;
                                    this.state.stateKnowShipDirection =false;
                                }
                                else return nextShot;
                            }
                            else{
                                //can just choose position
                                return nextShot;
                            }
                        }
                        else{
                            console.log("next guess left");
                            //next guess to left

                            let nextShot:Position =  new Position(previousShot.Position.Row, this.getLeftColumn(previousShot.Position.Column));
                            if(this.alreadyMissAt(nextShot)){
                                //sunk ***********
                                console.log("sunk in moving left");
                                this.state.stateHitShipButNotSunk = false;
                                this.state.stateKnowShipDirection =false;
                                return this.getNextTarget(gameState,new Position(previousShot.Position.Row, previousShot.Position.Column));
                            }
                            return nextShot;
                        }
                    }
                    else{
                        console.log("vert ship")
                        //vertical ship
                        if(this.state.stateWalkingPositiveAxis){
                            //next guess up
                            let nextShot:Position =  new Position(this.getUpRow(previousShot.Position.Row), previousShot.Position.Column);
                            if(this.alreadyHitAt(nextShot) || this.alreadyMissAt(nextShot) || nextShot.Row.charAt(0) == 'J'){
                                //clearly to up is a miss or not on screen so need to find next down guess
                                nextShot =  new Position(this.getDownRow(previousShot.Position.Row), previousShot.Position.Column);
                                this.state.stateWalkingPositiveAxis = false;
                                let noMissDown = false;
                                for(let i = 2; i <= 4; i ++){
                                    //test position i positions left of current guess
                                    nextShot =  new Position(this.getDownRow(nextShot.Row), previousShot.Position.Column);
                                    if(this.alreadyMissAt(nextShot)){
                                        // sunk************
                                        this.state.stateHitShipButNotSunk = false;
                                        this.state.stateKnowShipDirection =false;
                                    }
                                    else if(!this.alreadyHitAt(nextShot)){
                                        //havent shot at this position before
                                        break;
                                    }
                                    else if(i == 4){
                                         noMissDown = true;
                                    }
                                }
                                if(noMissDown){
                                    //sunk ****************
                                    console.log("SUNK");
                                    this.state.stateHitShipButNotSunk = false;
                                    this.state.stateKnowShipDirection =false;
                                    return this.getNextTarget(gameState,new Position(previousShot.Position.Row, previousShot.Position.Column));
                                }
                                else {
                                    return nextShot;
                                }
                            }
                            else{
                                //can just choose position
                                return nextShot;
                            }
                        }
                        else{
                            //next guess down
                            console.log("guessing down")
                            let nextShot:Position =  new Position(this.getDownRow(previousShot.Position.Row), previousShot.Position.Column);
                            if(this.alreadyMissAt(nextShot)){
                                //sunk ***********
                                console.log("SUNK");
                                this.state.stateHitShipButNotSunk = false;
                                this.state.stateKnowShipDirection =false;
                                return this.getNextTarget(gameState,new Position(previousShot.Position.Row, previousShot.Position.Column));
                            }
                            return nextShot;
                        }
                    }
                }
                else{
                    //find the direction by hitting around the hit
                    console.log("calling unknownDirectoin")
                    this.state.stateHitShipButNotSunk = true;
                    return this.hitButUnknownDirection(new Position(previousShot.Position.Row, previousShot.Position.Column));
                }
            }
            else
            {
                //not hit
                console.log("last shot missed")
                if(this.state.missArray)this.state.missArray[this.state.missArray.length] = new Position(previousShot.Position.Row,previousShot.Position.Column);
                else this.state.missArray = [new Position(previousShot.Position.Row,previousShot.Position.Column)];

                if(!this.state.stateHitShipButNotSunk){
                    console.log("not sinking");
                    return this.getNextTarget(gameState, new Position(previousShot.Position.Row,previousShot.Position.Column));
                }
                else if(!this.state.stateKnowShipDirection){
                    let hitPosition:Position;
                    for(let i = 2; i <= 5; i ++){
                        if(gameState.MyShots[gameState.MyShots.length-i].WasHit){
                            const therePos = gameState.MyShots[gameState.MyShots.length-i].Position
                            hitPosition = new Position(therePos.Row, therePos.Column);
                            break; 
                        }
                    }
                    return this.hitButUnknownDirection(hitPosition);
                }
                else
                {
                    //end of ship come to *******check other end or sunk
                    if(!this.state.stateWalkingPositiveAxis){
                        //sunk 
                        console.log("SUNK");
                        this.state.stateHitShipButNotSunk = false;
                        this.state.stateKnowShipDirection =false;
                        return this.getNextTarget(gameState, new Position(previousShot.Position.Row, previousShot.Position.Column));
                    }
                    else{
                        this.state.stateWalkingPositiveAxis = false;
                        // TODO this make it check the other end of the ship -- this is called when come to the end of a ship walking up/ right - need to confirm other end not hit see page
                        let nextShot:Position = new Position(previousShot.Position.Row, previousShot.Position.Column);
                        for(let i = 1; i < 6; i ++){
                            if(this.state.stateHorizontalShip)  nextShot = new Position(nextShot.Row, this.getLeftColumn(nextShot.Column));
                            else                                nextShot = new Position(this.getDownRow(nextShot.Row), nextShot.Column);

                            if(!this.shotOnBoard(nextShot) || this.alreadyMissAt(nextShot)){
                                //sunk
                               console.log(nextShot.print("sunk method"));
                                this.state.stateHitShipButNotSunk = false;
                                this.state.stateKnowShipDirection =false;
                                return this.getNextTarget(gameState, new Position(previousShot.Position.Row, previousShot.Position.Column));
                            }
                            else if(this.alreadyHitAt(nextShot)){
                                continue;
                            }
                            else{
                                console.log(nextShot.print("ship next try at "));
                                break;
                            }
                        }
                        return nextShot;
                }
                }
            }

            return this.getNextTarget(gameState,new Position(previousShot.Position.Row,previousShot.Position.Column));
        }
        this.state = new StateClass();
        return { Row: "A", Column: 1 };  
    }

    public alreadyHitAt(pos:Position):boolean{
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



    private findBottomOfHits(gameState):Position
    {
        var bottomPos;
        for(let i = 1; i < gameState.length; i ++){
            if(gameState.MyShots[gameState.length-i].WasHit) bottomPos = gameState.MyShots[gameState.length-i].position;
        }
        return bottomPos;
    }

    private getNextTarget(gameState,position:Position):Position {
        return this.targetMethodTryRandomBlackSquare(gameState);
    }


    private targetMethodTryRandomBlackSquare(gameState):Position{
        console.log("get next Target method ");
        var column = (Math.floor(Math.random()*10)+1);
        //col is random value between 1 and 10;
        var row;
        if(column%2 == 0){
            row = String.fromCharCode((Math.floor(Math.random()*5))*2+65);
        }
        else{
            row = String.fromCharCode((Math.floor(Math.random()*5))*2+66);
        }
        const nextPos:Position = new Position(row, column);
        console.log(nextPos.print("trying point"));
        if(!this.alreadyHitAt(nextPos) && !this.alreadyMissAt(nextPos)) return nextPos;
        else return this.targetMethodTryRandomBlackSquare(gameState);
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

