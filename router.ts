import * as express from 'express';
import * as bodyParser from 'body-parser';
import {MyBot} from './src/my-bot';

export class Router {
    public static route(): void {
        let app = express();
        let myBot = new MyBot();

        app.set('port', (process.env.PORT || 5000));
        app.use(express.static(__dirname + '/public'));
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());

        app.get('/GetShipPositions', (req, res) => {
            let positions = myBot.getShipPositions();
            res.send(positions);
        });

        app.post('/SelectTarget', (req, res) => {
            //console.log(req.body);
            let target = myBot.selectTarget(req.body);
            res.send(target);
        });

        app.listen(app.get('port'), () => {
            console.log("Node app is running at localhost:" + app.get('port'));
        });

               

    }

    private static config = {
        apiKey: "AIzaSyD6ACQdu7gK-BgtJs-3Hu1Lkczk8fp0Abo",
        authDomain: "brokenbot-battleships.firebaseapp.com",
        databaseURL: "https://brokenbot-battleships.firebaseio.com",
        projectId: "brokenbot-battleships",
        storageBucket: "brokenbot-battleships.appspot.com",
        messagingSenderId: "705952561534"
    };

}

Router.route();