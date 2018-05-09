# APM

Language Agent for Node.js for Express.

# Setup

APM is configured as an expressjs middleware.

First, install all the project dependencies with `$ npm i`.

Then, install the `node-gyp` build system with `$ npm i node-gyp -g`.

# Usage

```js
const app = require('express')();
const apm = require('express-apm');

// setup the Express middleware.
// load this middleware first
// contrast lang agent will capture requests and record metrics.
app.use(apm);
```
