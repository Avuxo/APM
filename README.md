# APM

Language Agent for Express and Node.js.
[![Build Status](https://travis-ci.com/Avuxo/APM.svg?branch=master)](https://travis-ci.com/Avuxo/APM)

![logo](https://i.imgur.com/EDZ0bTE.png)

## Setup

Prerequisites: GNU Make, Python, a c++ compiler (tested with g++ and clang++)

First, install `node-gyp`, the Node native build tool. Run `npm i node-gyp -g` to install it globally.

Install the package into your project with `$ npm i express-apm`.

Installation note: Make sure that you have a version of Python supported by node-gyp (= v2.5.0 & < 3.0.0).

Tested using Node.js v9.11.1 and v8.11.1.

## Usage

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

```js
const app = require('express')();
const apm = require('express-apm');

// setup the Express middleware.
// load this middleware first
// pass `null' when you don't wannt use the local express-apm analytics server.
app.use(apm(null));
```

To use elsewhere in Javascript, use the exported `Heap` class. This will provide you with the same information that is otherwise exported through the Express middleware.

```js
const apm = require('express-apm');

// start heap check
var startHeap = new apm.Heap();

// do stuff

var finishHeap = finishHeap(); // finish heap check and diff the two
console.log(finishHeap);
```

When not using the express middleware, time checks are not performed. This can easily be implemented with a number of timing packages or through the use of the Javascript `Date.now()` functionality.

## Purpose

When writing modern Express applications for a large userbase, it's important to see much of your server's limited resources are being used by your app. As such, tools like APM provide an interface to see deep into what your application is doing. Is it allocating too many objects? Are too many strings being allocated? By looking at the numbers and modifying your code, you can check for changes in speed and performance. Through the Express middleware, one can also quickly check and compare the time to complete the requests.