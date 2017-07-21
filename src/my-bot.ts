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
    
    public getShipPositions(): ShipPlace[] {
        let exists: boolean = false;
        let counter: number = 0;        
        do {
            this.matchId = Math.floor(Math.random() * 10000) + 1;
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
        let shipPlaces: ShipPlace[] = [];
        let done: boolean = false;
        counter = 0;
        do {
            counter++;
            shipPlaces.push(this.getAirCarrierPlace(shipPlaces));
            if (shipPlaces[0].StartingSquare.Column === -1) {
                continue;
            }
            shipPlaces.push(this.getBattleshipPlace(shipPlaces));
            if (shipPlaces[1].StartingSquare.Column === -1) {
                continue;
            }
            shipPlaces.push(this.getDestroyerPlace(shipPlaces));
            if (shipPlaces[2].StartingSquare.Column === -1) {
                continue;
            }
            shipPlaces.push(this.getSubmarinePlace(shipPlaces));
            if (shipPlaces[3].StartingSquare.Column === -1) {
                continue;
            }
            shipPlaces.push(this.getPatrolPlace(shipPlaces));
            if (shipPlaces[4].StartingSquare.Column === -1) {
                continue;
            }
            done = true;
        } while ((!done) && (counter < 1000))
        if (counter === 1000) {
            throw new Error("Infinite loop generating ship positions");
        }
        console.log(shipPlaces);
        return shipPlaces;
    }

    public selectTarget(gamestate): Promise<Position> {
        return new Promise((resolve, reject) => {
            if (gamestate.MyShots.length === 0) {
                resolve(this.randomShot(gamestate));
            }
            const previousShot: Shot = gamestate.MyShots && gamestate.MyShots[gamestate.MyShots.length-1];
            let target: Position = this.getNextTarget(previousShot.Position);
            let result: boolean = previousShot.WasHit;
            if (result) {
                let updates: any = {};
                updates["hitmode"] = true
                firebase.database().ref('matches/' + this.matchId.toString()).update(updates);
            }
            firebase.database().ref('matches/' + this.matchId.toString()).once('value').then((snapshot) => {
                if (snapshot.val().hitmode) {
                    target = this.track(gamestate);
                }
                return resolve(target);
            });
        })
        
        
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

    private getAirCarrierPlace(shipPlaces: ShipPlace[]): ShipPlace {
        let counter:number = 0;
        let place: ShipPlace = { StartingSquare: { Row: "A", Column: 1 }, EndingSquare : { Row: "A", Column: 5 } };
        let collision: boolean = false;
        do {
            let places: ShipPlace[] = shipPlaces.slice(0);
            collision = false;
            const row: string = String.fromCharCode(Math.floor(Math.random() * 10) + 65);
            const column: number = Math.floor(Math.random() * 10) + 1;
            if ((row > 'F') && (column > 6)) {
                continue;
            }
            if (((Math.random() < 0.5) && (row <= 'F')) || (column > 6)) {
                place = { StartingSquare: { Row: row, Column: column }, EndingSquare: { Row: String.fromCharCode(row.charCodeAt(0) + 4), Column: column } };
            } else {
                place = { StartingSquare: { Row: row, Column: column }, EndingSquare: { Row: row, Column: (column + 4) } };
            }
            places.push(place);
            if (this.detectCollision(places)) {
                collision = true;
                counter++;
            }
        } while((counter < 50) && (collision))
        if (counter === 50) {
            return { StartingSquare: { Row: "A", Column: -1 }, EndingSquare : { Row: "A", Column: 5 } };
        }
        return place;
    }

    private getBattleshipPlace(shipPlaces: ShipPlace[]): ShipPlace {
        let counter:number = 0;
        let place: ShipPlace = { StartingSquare: { Row: "C", Column: 1 }, EndingSquare : { Row: "C", Column: 4 } };
        let collision: boolean = false;
        do {
            let places: ShipPlace[] = shipPlaces.slice(0);
            collision = false;
            const row: string = String.fromCharCode(Math.floor(Math.random() * 10) + 65);
            const column: number = Math.floor(Math.random() * 10) + 1;
            if ((row > 'G') && (column > 7)) {
                continue;
            }
            if (((Math.random() < 0.5) && (row <= 'G')) || (column > 7)) {
                place = { StartingSquare: { Row: row, Column: column }, EndingSquare: { Row: String.fromCharCode(row.charCodeAt(0) + 3), Column: column } };
            } else {
                place = { StartingSquare: { Row: row, Column: column }, EndingSquare: { Row: row, Column: (column + 3) } };
            }
            places.push(place);
            if (this.detectCollision(places)) {
                collision = true;
                counter++;
            }
        } while((counter < 50) && (collision))
        if (counter === 50) {
            return { StartingSquare: { Row: "A", Column: -1 }, EndingSquare : { Row: "A", Column: 5 } };
        }
        return place;
    }

    private getDestroyerPlace(shipPlaces: ShipPlace[]): ShipPlace {
        let counter:number = 0;
        let place: ShipPlace = { StartingSquare: { Row: "E", Column: 1 }, EndingSquare : { Row: "E", Column: 3 } };
        let collision: boolean = false;
        do {
            let places: ShipPlace[] = shipPlaces.slice(0);
            collision = false;
            const row: string = String.fromCharCode(Math.floor(Math.random() * 10) + 65);
            const column: number = Math.floor(Math.random() * 10) + 1;
            if ((row > 'H') && (column > 8)) {
                continue;
            }
            if (((Math.random() < 0.5) && (row <= 'H')) || (column > 8)) {
                place = { StartingSquare: { Row: row, Column: column }, EndingSquare: { Row: String.fromCharCode(row.charCodeAt(0) + 2), Column: column } };
            } else {
                place = { StartingSquare: { Row: row, Column: column }, EndingSquare: { Row: row, Column: (column + 2) } };
            }
            places.push(place);
            if (this.detectCollision(places)) {
                collision = true;
                counter++;
            }
        } while((counter < 50) && (collision))
        if (counter === 50) {
            return { StartingSquare: { Row: "A", Column: -1 }, EndingSquare : { Row: "A", Column: 5 } };
        }
        return place;
    }

    private getSubmarinePlace(shipPlaces: ShipPlace[]): ShipPlace {
        let counter:number = 0;
        let place: ShipPlace = { StartingSquare: { Row: "G", Column: 1 }, EndingSquare : { Row: "G", Column: 3 } };
        let collision: boolean = false;
        do {
            let places: ShipPlace[] = shipPlaces.slice(0);
            collision = false;
            const row: string = String.fromCharCode(Math.floor(Math.random() * 10) + 65);
            const column: number = Math.floor(Math.random() * 10) + 1;
            if ((row > 'H') && (column > 8)) {
                continue;
            }
            if (((Math.random() < 0.5) && (row <= 'H')) || (column > 8)) {
                place = { StartingSquare: { Row: row, Column: column }, EndingSquare: { Row: String.fromCharCode(row.charCodeAt(0) + 2), Column: column } };
            } else {
                place = { StartingSquare: { Row: row, Column: column }, EndingSquare: { Row: row, Column: (column + 2) } };
            }
            places.push(place);
            if (this.detectCollision(places)) {
                collision = true;
                counter++;
            }
        } while((counter < 50) && (collision))
        if (counter === 50) {
            return { StartingSquare: { Row: "A", Column: -1 }, EndingSquare : { Row: "A", Column: 5 } };
        }
        return place;
    }

    private getPatrolPlace(shipPlaces: ShipPlace[]): ShipPlace {
        let counter:number = 0;
        let place: ShipPlace = { StartingSquare: { Row: "I", Column: 1 }, EndingSquare : { Row: "I", Column: 2 } };
        let collision: boolean = false;
        do {
            let places: ShipPlace[] = shipPlaces.slice(0);
            collision = false;
            const row: string = String.fromCharCode(Math.floor(Math.random() * 10) + 65);
            const column: number = Math.floor(Math.random() * 10) + 1;
            if ((row > 'I') && (column > 9)) {
                continue;
            }
            if (((Math.random() < 0.5) && (row <= 'I')) || (column > 9)) {
                place = { StartingSquare: { Row: row, Column: column }, EndingSquare: { Row: String.fromCharCode(row.charCodeAt(0) + 1), Column: column } };
            } else {
                place = { StartingSquare: { Row: row, Column: column }, EndingSquare: { Row: row, Column: (column + 1) } };
            }
            places.push(place);
            if (this.detectCollision(places)) {
                collision = true;
                counter++;
            }
        } while((counter < 50) && (collision))
        if (counter === 50) {
            return { StartingSquare: { Row: "A", Column: -1 }, EndingSquare : { Row: "A", Column: 5 } };
        }
        return place;
    }

    private detectCollision(shipPlaces: ShipPlace[]): boolean {
        for (let i: number = 0; i < shipPlaces.length - 1; i++) {
            let ship1: Position[] = this.generateShipSquares(shipPlaces[i]);
            for (let j: number = i + 1; j < shipPlaces.length; j++) {
                let ship2: Set<Position> = this.generateAdjacentSquares(this.generateShipSquares(shipPlaces[j]));
                for (let x: number = 0; x < ship1.length; x++) {
                    if (ship2.has(ship1[x])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private generateShipSquares(shipPlace: ShipPlace): Position[] {
        let ship: Position[] = [];
        if (shipPlace.StartingSquare.Row === shipPlace.EndingSquare.Row) {
            for (let i: number = shipPlace.StartingSquare.Column; i <= shipPlace.EndingSquare.Column; i++) {
                ship.push({
                    Row: shipPlace.StartingSquare.Row,
                    Column: i
                });
            }
        } else {
            for (let i: number = shipPlace.StartingSquare.Row.charCodeAt(0); i <= shipPlace.EndingSquare.Row.charCodeAt(0); i++) {
                ship.push({
                    Row: String.fromCharCode(i),
                    Column: shipPlace.StartingSquare.Column
                });
            }
        }
        return ship;
    }

    private generateAdjacentSquares(ship: Position[]): Set<Position> {
        let set: Set<Position> = new Set<Position>();
        console.log(ship);
        for (let i: number = 1; i < ship.length; i++) {
            set.add(ship[i]);
            set.add({ Row: ship[i].Row, Column: ship[i].Column + 1 });
            set.add({ Row: ship[i].Row, Column: ship[i].Column + 1 });
            set.add({ Row: String.fromCharCode(ship[i].Row.charCodeAt(0) + 1), Column: ship[i].Column + 1 });
            set.add({ Row: String.fromCharCode(ship[i].Row.charCodeAt(0) - 1), Column: ship[i].Column + 1 });
        }
        console.log(set);
        return set;
    }

    private randomShot(gamestate): Position {
        let position: Position = { Row: 'A', Column: 1 };
        let found: boolean = false;
        do {
            const row: string = String.fromCharCode(Math.floor(Math.random() * 10) + 65);
            const column: number = Math.floor(Math.random() * 10) + 1;
            position = { Row: row, Column: column};
            found = false;
            for (let i = 0; i < gamestate.MyShots.length; i++) {
                //console.log(gamestate.MyShots[i].Position);
                if ((gamestate.MyShots[i].Position.Row === position.Row) && (gamestate.MyShots[i].Position.Column === position.Column)) {
                    found = true;
                    break;
                }
            }
        } while (found)
        return position
    }

    private track(gamestate): Position {
        return this.randomShot(gamestate);
    }
}

