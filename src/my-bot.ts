//import * as firebase from 'firebase';
import { Position } from './interfaces/position';
import { ShipPlace } from './interfaces/shipPlace';
import { Shot } from './interfaces/shot';

export class MyBot {

    private database;
    private config = {
        apiKey: "AIzaSyD6ACQdu7gK-BgtJs-3Hu1Lkczk8fp0Abo",
        authDomain: "brokenbot-battleships.firebaseapp.com",
        databaseURL: "https://brokenbot-battleships.firebaseio.com",
        storageBucket: "brokenbot-battleships.appspot.com"
    };
    private gameNum: number;
    private matchId: number;

    constructor() {
        //firebase.initializeApp(this.config);
        //this.authenticate();
        //this.database = firebase.database();
        this.gameNum = 1;
        this.matchId = Math.floor(Math.random() * 10000) + 1;
        //let exists: boolean = false;
        //let counter = 0;
        /*do {
            this.database.ref('matches/' + this.matchId.toString()).once('value').then((snapshot) => {
                if (snapshot.val()) {
                    exists = true;
                }
            });
            counter++;
            if (counter > 10000) {
                throw new Error("Infinite loop when constructing bot");
            }
        } while (exists)*/
        /*this.database.ref('matches/' + this.matchId.toString()).set({
            started: true
        });*/
    }

    public getShipPositions() {
        
        return [
            { StartingSquare: { Row: "A", Column: 1 }, EndingSquare : { Row: "A", Column: 5 } },
            { StartingSquare: { Row: "C", Column: 1 }, EndingSquare : { Row: "C", Column: 4 } },
            { StartingSquare: { Row: "E", Column: 1 }, EndingSquare : { Row: "E", Column: 3 } },
            { StartingSquare: { Row: "G", Column: 1 }, EndingSquare : { Row: "G", Column: 3 } },
            { StartingSquare: { Row: "I", Column: 1 }, EndingSquare : { Row: "I", Column: 2 } },
        ]
    }

    public selectTarget(gamestate) {
        var previousShot = gamestate.MyShots && gamestate.MyShots[gamestate.MyShots.length-1];
        if(previousShot) {
            return this.getNextTarget(previousShot.Position);
        }
        return { Row: "A", Column: 1 };  
    }

    private getNextTarget(position) {
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

    private 

    /*private authenticate(): void {
        firebase.auth().signInWithEmailAndPassword(
            "david.may-miller@softwire.com",
            "securePassword3"
        );
    }*/
}

