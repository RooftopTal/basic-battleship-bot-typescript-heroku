import * as firebase from 'firebase';

export class Database {
    private config = {
        apiKey: "AIzaSyD6ACQdu7gK-BgtJs-3Hu1Lkczk8fp0Abo",
        authDomain: "brokenbot-battleships.firebaseapp.com",
        databaseURL: "https://brokenbot-battleships.firebaseio.com",
        storageBucket: "brokenbot-battleships.appspot.com"
    };

    constructor() {
        firebase.initializeApp(this.config);
        this.authenticate();
    }

    private authenticate(): void {
        firebase.auth().signInWithEmailAndPassword(
            "david.may-miller@softwire.com",
            "securePassword3"
        );
    }

    public getSnapshot(matchId: number): firebase.Promise<any> {
        return firebase.database().ref('matches/' + matchId.toString()).once('value')
    }

    public setData(matchId: number, data: any): void {
        firebase.database().ref('matches/' + matchId.toString()).set(data);
    }
}