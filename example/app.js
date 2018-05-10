const app = require('express')();
const apm = require('../index');

const PORT = 3000;

const server = new apm.server(8080);

app.use(apm(server.emitter));

app.get('/', (req, res) => {
    res.send('Hello, world!');
});


app.listen(PORT, () => {
    console.log('Listening on port ${PORT}');
})
