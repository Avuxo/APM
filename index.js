const heap = require('bindings')('apm');

/*
  Express middleware
  app.use(MODULE_NAME);
*/
module.exports = (req, res, next) => {
    const startHeap = new heap.Heap();
    const startTime =  Date.now();

    // once the request has finished, deal with the result.
    res.once('finish', () => {
        let finishHeap = startHeap.stop();
        finishHeap.time = Date.now() - startTime; // delta time is in milliseconds
        console.log(finishHeap);
    });

    next();
}

/*independant heap class*/
module.exports.Heap = heap.Heap;
