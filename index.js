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

            // garbage collection happened during the request
            if(finishHeap.numStrings < 0){
                finishHeap.numStrings = 0;
            }
            
            // garbage collection happened during the request
            if(finishHeap.numClasses < 0){
                finisheeap.numClasses = 0;
            }

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
