const apm = require('../index'); // load the library


var f = "first";
var j = "second";
var i = "third";
var q = "third";
var w = "third";


var startHeap = new apm.Heap();

var finishedHeap = startHeap.stop();
console.log(finishedHeap);
