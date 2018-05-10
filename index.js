const heap = require('bindings')('apm');
const server = require('./src/server');

/*
  Express middleware
  app.use(MODULE_NAME);

  emitter: event emitter for when a request has finished
           null if unwanted
*/
module.exports = (emitter) => {
    return (req, res, next) => {
        const startHeap = new heap.Heap();
        const startTime =  Date.now();

        // once the request has finished, deal with the result.
        res.once('finish', () => {
            let finishHeap = startHeap.stop();
            finishHeap.time = Date.now() - startTime; // delta time is in milliseconds
            //console.log(finishHeap);

            // null is supposed to be used, but catch undefined too
            if(emitter !== undefined && emitter !== null){
                // announce the finished heap's data
                emitter.emit('heap', finishHeap);
            } else {
                console.log(finishedHeap);
            }
        });

        next();
    }
}

/*independant heap class*/
module.exports.Heap = heap.Heap;

module.exports.server = server;
