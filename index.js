const heap = require('bindings')('apm');

module.exports = (req, res, next) => {
    const hd = new heap.Heap();
    res.once('finish', () => {
        console.log(hd.stop());
    });

    next();
}
