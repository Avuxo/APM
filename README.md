# APM

Language Agent for Express and Node.js.
[![Build Status](https://travis-ci.com/Avuxo/APM.svg?branch=master)](https://travis-ci.com/Avuxo/APM)

![logo](https://i.imgur.com/EDZ0bTE.png)

![badge](https://nodei.co/npm/express-apm.png)

## Setup

Prerequisites: GNU Make, Python, and a c++ compiler (tested with g++ and clang++)

First, install `node-gyp`: the Node native build tool. You can run `npm i node-gyp -g` to install it globally.

Install the `express-apm` package into your project with `$ npm i express-apm`.

Installation note: Make sure that you have a version of Python supported by node-gyp (= v2.5.0 & < 3.0.0).

Support tested for Node.js 8 and 9.

## Usage

![example](graph-screenshot.png)

To embed in express and view the analytics in a browser, simply use the provided middleware:

```js
const app = require('express')();
const apm = require('express-apm');

// local server on port 8080
const server = new apm.server(8080);

// use the event emitter from the `server' object.
// make sure to load this middleware first so it can check the entire request.
// express-apm will capture requests and record metrics.
app.use(apm(server.emitter));

// your express code
```
When using APM with Express, the front-end graphs will update every 3 seconds -- assuming there is a change -- and will pull the most recent successful request. All previous requests will be loaded when you open the dashboard for the first time. To load all previous requests (including those missde during the 3 second intervals), refresh the page.

The REST endpoint `/metrics` on the APM port will allow you to get the most recent request outside of the dashboard. The `/fullMetrics` endpoint provides all of the previous requests.


Or without the use of the built in express server:

```js
const app = require('express')();
const apm = require('express-apm');

// setup the Express middleware.
// load this middleware first
// pass `null' when you don't want use the local express-apm analytics server.
app.use(apm(null));
```

APM can be used outside of Express aswell. In order to use outside of your webapp, simply use the exported `Heap` class. First, instantiate the `Heap` class, and when you're done call `Heap.stop();`

```js
const apm = require('express-apm');

// start heap check
var startHeap = new apm.Heap();

// do stuff

var finishHeap = startHeap.stop(); // finish heap check and diff the two
console.log(finishHeap);
```

When not using the express middleware, time checks are not performed. This can easily be implemented with a number of timing packages or through the use of the Javascript `Date.now()` functionality.

Furthermore, heap size checks are not performed, but this can also be accessed natively in Node.js. Use the `process.memoryUsage()` function to get this information.

## Purpose

When writing modern Express applications for a large userbase, it's important to see much of your server's limited resources are being used by your app. As such, tools like APM provide an interface to see deep into what your application is doing. Is it allocating too many objects? Are too many strings being allocated? By looking at the numbers and modifying your code, you can check for changes in speed and performance. Through the Express middleware, one can also quickly check and compare the time to complete the requests.