# APM

Language Agent for Express and Node.js.

# Setup

First, install `node-gyp`, the Node native build tool. Run `npm i node-gyp -g` to install it globally.

Install the package into your project with `$ npm i express-apm`.

Installation note: Make sure that you have a version of Python supported by node-gyp (= v2.5.0 & < 3.0.0).

# Usage

```js
const app = require('express')();
const apm = require('express-apm');

// setup the Express middleware.
// load this middleware first
// contrast lang agent will capture requests and record metrics.
app.use(apm);
```
