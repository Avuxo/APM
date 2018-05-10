const should = require('should');
const apm = require('./');

/*
  APM unit tests
*/

// test to make sure the export worked properly
// if the export failed then the c++ module failed to load the `Heap' class.
// if the c++ module failed, then something was wrong with compiling
// (likely a version conflict with Node.js)
describe('apm', () => {
    it('should export a class', (done) => {
        // check the export
        should.exist(apm.Heap);
        done();
    });
});


// test for correctly formatted class
// this test doubles as a check for seeing if the C++ module works properly
// if the C++ module doesn't work, the class will be exported empty.
describe('the exported class', () => {
    it('should have two numeric fields', (done) => {
        let heap = new apm.Heap();
        let diff = heap.stop();

        // make sure fields exist
        should(diff).have.property('numStrings');
        should(diff).have.property('numClasses');

        // make sure they're numbers and thus not `undefined'
        (diff.numStrings).should.be.a.Number();
        (diff.numClasses).should.be.a.Number();
        
        done();
    });
});
