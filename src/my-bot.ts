import * as firebase from 'firebase';
import { Position } from './interfaces/position';
import { ShipPlace } from './interfaces/shipPlace';
import { Shot } from './interfaces/shot';

export class MyBot {

    private config = {
        apiKey: "AIzaSyD6ACQdu7gK-BgtJs-3Hu1Lkczk8fp0Abo",
        authDomain: "brokenbot-battleships.firebaseapp.com",
        databaseURL: "https://brokenbot-battleships.firebaseio.com",
        storageBucket: "brokenbot-battleships.appspot.com"
    };
    private matchId: number;

    constructor() {
        firebase.initializeApp(this.config);
        this.authenticate();        
    }
    
    public getShipPositions() {
        let exists: boolean = false;
        let counter: number = 0;        
        do {
            this.matchId = Math.floor(Math.random() * 1000) + 1;
            firebase.database().ref('matches/' + this.matchId.toString()).once('value').then((snapshot) => {
                if (snapshot.val()) {
                    exists = true;
                } else {
                    exists = false;
                }
            });
            counter++;
            if (counter > 10000) {
                throw new Error("Infinite loop when constructing bot");
            }
        } while (exists)
        firebase.database().ref('matches/' + this.matchId.toString()).set({
            started: true,
            hitmode: false
        });
        return [
            this.getAirCarrierPlace(),
            this.getBattleshipPlace(),
            this.getDestroyerPlace(),
            this.getSubmarinePlace(),
            this.getPatrolPlace(),
        ]
    }

    public selectTarget(gamestate): Position {
        if (gamestate.MyShots.length === 0) {
            return this.randomShot(gamestate)
        }
        var previousShot: Shot = gamestate.MyShots && gamestate.MyShots[gamestate.MyShots.length-1];
        let result: Position = this.getNextTarget(previousShot.Position);
        firebase.database().ref('matches/' + this.matchId.toString()).set({
            hitmode: true
        });
        const database = firebase.database().ref('matches/' + this.matchId.toString()).once('value')
        const dataPromise = database.then((snapshot) => {
            if (snapshot.val().hitmode) {
                return result = this.track(gamestate);
            }
        });
        console.log(dataPromise);                   
        return result;
    }

    private getNextTarget(position: Position): Position {
        var column = this.getNextColumn(position.Column);
        var row = column === 1 ? this.getNextRow(position.Row) : position.Row;
        return { Row: row, Column: column }
    }

    private getNextRow(row) {
        var newRow = row.charCodeAt(0) + 1;
        if(newRow > 'J'.charCodeAt(0)) {
            return 'A';
        }
        return String.fromCharCode(newRow);
    }

    private getNextColumn(column) {
        return column % 10 + 1;
    }

    private authenticate(): void {
        firebase.auth().signInWithEmailAndPassword(
            "david.may-miller@softwire.com",
            "securePassword3"
        );
    }

    private getAirCarrierPlace(): ShipPlace {
        return { StartingSquare: { Row: "A", Column: 1 }, EndingSquare : { Row: "A", Column: 5 } }
    }

    private getBattleshipPlace(): ShipPlace {
        return { StartingSquare: { Row: "C", Column: 1 }, EndingSquare : { Row: "C", Column: 4 } }
    }

    private getDestroyerPlace(): ShipPlace {
        return { StartingSquare: { Row: "E", Column: 1 }, EndingSquare : { Row: "E", Column: 3 } }
    }

    private getSubmarinePlace(): ShipPlace {
        return { StartingSquare: { Row: "G", Column: 1 }, EndingSquare : { Row: "G", Column: 3 } }
    }

    private getPatrolPlace(): ShipPlace {
        return { StartingSquare: { Row: "I", Column: 1 }, EndingSquare : { Row: "I", Column: 2 } }
    }

    private randomShot(gamestate): Position {
        let position: Position = { Row: 'A', Column: 1 };
        do {
            const row: string = String.fromCharCode(Math.floor(Math.random() * 10) + 65);
            const column: number = Math.floor(Math.random() * 10);
            position = { Row: row, Column: column};
        } while (gamestate.MyShots.includes(position))
        return position
    }

    private track(gamestate): Position {
        return this.randomShot(gamestate);
    }
}

