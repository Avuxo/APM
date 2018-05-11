const express = require('express');
const EventEmitter = require('events');
const path = require('path');

/*
  Server
  Server for monitoring statistics
  Listens for events from APM's heap functionality
*/

class Server{
    constructor(port){
        this.port = port;
        this.emitter = new EventEmitter();
        this.app = express();
        this.setupRoutes();
        this.data = []; // collected data.

        // setup static file serving (js, css, img).
        this.app.use('/public', express.static(path.resolve(__dirname, '..', 'public')));

        this.emitter.on('heap', (finished) => {
            // push the data into the collection.
            this.data.push(finished);
        });
        
        this.app.listen(this.port, () => {
            console.log(`APM Listening on port ${this.port}`);
        });
    }

    // setup express routes
    setupRoutes(){
        this.app.get('/', (req, res) => {
            // send the index
            res.sendFile(path.resolve(__dirname, '..', 'views/index.html'));
        });

        // REST endpoint for metrics
        this.app.get('/metrics', (req, res) => {
            // send the most recent metrics
            if(this.data[0] !== undefined){
                res.send(JSON.stringify(this.data[this.data.length - 1]));
            } else { // no data collected yet.
                res.sendStatus(503);
            }
        });

        // called at startup of front-end, requests all past metrics
        // this is so the charts can build a past repetoire of data
        this.app.get('/fullMetrics', (req, res) => {
            if(this.data[0] !== undefined){
                let response = {
                    "data": this.data
                };
                res.send(JSON.stringify(response));
            } else { // no data collected yet.
                res.sendStatus(503);
            }
        });
    }
}

module.exports = Server;
