const app = require('express')();
const apm = require('../index');

const PORT = 3000;

// create an APM server.
const server = new apm.server(8080);

// add the APM middleware
app.use(apm(server.emitter));

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// start listening on `PORT'.
app.listen(PORT, () => {
    console.log(`Example listening on port ${PORT}`);
})
