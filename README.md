# APM

Language Agent for Express and Node.js.
[![Build Status](https://travis-ci.com/Avuxo/APM.svg?branch=master)](https://travis-ci.com/Avuxo/APM)

![logo](https://i.imgur.com/ofYkOLj.png)

# Setup

Prerequisites: GNU Make, Python, a c++ compiler (tested with g++ and clang++)

First, install `node-gyp`, the Node native build tool. Run `npm i node-gyp -g` to install it globally.

Install the package into your project with `$ npm i express-apm`.

Installation note: Make sure that you have a version of Python supported by node-gyp (= v2.5.0 & < 3.0.0).

Tested using Node.js v9.11.1 and v8.11.1.

# Usage

```js
const app = require('express')();
const apm = require('express-apm');

// setup the Express middleware.
// load this middleware first
// express-apm will capture requests and record metrics.
app.use(apm);
```
