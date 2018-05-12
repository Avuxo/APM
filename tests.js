const should = require('should');
const apm = require('./');
const supertest =  require('supertest');
const expect = require('chai').expect;

// one api (`api') is for the APM dash.
// the other is for testing the actual usage of the original page.
const api = supertest('http://localhost:8080');
const mainApi = supertest('http://localhost:3000');
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

// test the api to make sure that the endpoints return expected data.
describe('the api', () => {

    // configure a test server.
    const app = require('express')();
    var apmServer = new apm.server(8080);

    app.use(apm(apmServer.emitter));

    app.get('/', (req, res) => {
        res.send("Test page");
    });

    const server = app.listen(3000);
    
    // configure the server.
    before((done) => {

        // give it some data so that it can return something
        // during the api test.
        mainApi.get('/')
            .expect(200)
            .end((err, res) => {
                // check to make sure the body properly sent.
                expect(res.body).to.not.equal(null);
                done();
            });
        
        
    });

    // metrics should return HTTP OK.
    it('should return a 200 status code', (done) => {
        // check both REST endpoints.a
        api.get('/metrics')
            .set('Accept', 'application/json')
            .expect(200);

        
        api.get('/fullMetrics')
            .set('Accept', 'application/json')
            .expect(200, done);
    });

    // metrics should return an object in the proper format
    // as defined in the README.
    it('should have proper formatting', (done) => {
        api.get('/metrics')
            .set('Accept', 'application/json')
            .expect(200) // HTTP OK
            .end((err, res) => {
                // convery from a HTTP Text response to JSON.
                let response = JSON.parse(res.text);

                // make sure that the result is valid
                expect(res).to.not.equal(null);
                expect(res.text).to.not.equal(null);

                // check to make sure each key exists
                // make sure each key contains valid data
                expect(response).to.have.property('id');
                expect(response.id).to.not.equal(null);

                expect(response).to.have.property('memoryUsed');
                expect(response.memoryUsed).to.not.equal(null);

                expect(response).to.have.property('numClasses');
                expect(response.numClasses).to.not.equal(null);

                expect(response).to.have.property('numNodes');
                expect(response.numNodes).to.not.equal(null);

                expect(response).to.have.property('numStrings');
                expect(response.numStrings).to.not.equal(null);

                expect(response).to.have.property('time');
                expect(response.time).to.not.equal(null);
            });

        // check the full metrics API
        api.get('/fullMetrics')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                // get and parse the data from the endpoint
                let response = JSON.parse(res.text);
                expect(response).to.not.equal(null);

                // check if the data exists and make sure it has non-null data.
                expect(response).to.have.property('data');
                expect(response.data).to.not.equal(null);

                // shut down the local express server for testing.
                done();
            });
    });

    after(() => {
        // to close the local express server, the process must be exited at the end.
        process.exit();
    });
    
});
