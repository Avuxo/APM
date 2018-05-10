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

        this.emitter.on('heap', (finished) => {
            console.log(finished);
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
    }
}

module.exports = Server;
