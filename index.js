const heap = require('bindings')('apm');

/*
  Express middleware
  app.use(MODULE_NAME);
*/
module.exports = (req, res, next) => {
    const hd = new heap.Heap();
    const startTime =  Date.now();
    
    res.once('finish', () => {
        let result = hd.stop();
        result.time = Date.now() - startTime; // delta time is in milliseconds
        console.log(result);
    });

    next();
}
