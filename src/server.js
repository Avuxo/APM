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

        this.emitter.on('heap', (finished) => {
            // push the data into the collection.
            this.data.push(finished);
        });
        
        this.app.listen(this.port, () => {
            console.log(`Listening on port ${port}`);
        });
    }

    // setup express routes
    setupRoutes(){
        this.app.get('/', (req, res) => {
            // send the index
            res.sendFile(path.resolve('views/index.html'));
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
    }
}

module.exports = Server;
