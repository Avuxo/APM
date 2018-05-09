const app = require('express')();
const heap = require('../index');

const PORT = 8080;

app.use(heap);

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(PORT, () => {
    console.log('Listening on port ${PORT}');
})
