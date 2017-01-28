# Simple Log For Super Agent 

[![Build Status](https://travis-ci.org/sebastianlzy/superagent-debugger.svg?branch=master)](https://travis-ci.org/sebastianlzy/superagent-debugger)
[![Coverage Status](https://coveralls.io/repos/github/sebastianlzy/superagent-debugger/badge.svg)](https://coveralls.io/github/sebastianlzy/superagent-debugger)

### Introduction
An easy and fast way to identify and replicate rogue request on the fly 

### Dependencies
Logging for [superagent](https://github.com/visionmedia/superagent)

-----------
### Install

```cli
npm install --save superagent-debugger
```

### Usage

```js
let superagent = require('superagent');
let superdebug = require('superagent-debugger');

superagent('GET', 'http://localhost:3000/debug')
    .set({Accept: 'application/json'})
    .query({superdebug: 'is-awesome'})
    .use(superdebug(console.info))
    .timeout(10000)
    .send()
    .end()
```

### Output Log
```log
super-curl curl -v -X GET -H 'User-Agent: node-superagent/3.3.2' -H 'Accept: application/json' http://localhost:3000/debug?superdebug=is-awesome +0ms
super-debug HTTP GET 200 http://localhost:3000/debug?superdebug=is-awesome (23ms) +25ms
```

### Using Debug
 ```
 DEBUG=super-debug,super-curl node sdk.js
 ```
![screeshot1](https://raw.githubusercontent.com/sebastianlzy/superagent-debugger/master/sample-log.jpg)

### options

```js
const options = {logName: 'logDebug', curlName: 'curlDebug'}
    
 superagent('GET', 'http://localhost:3000/debug')
     .set({Accept: 'application/json'})
     .query({superdebug: 'is-awesome'})
     .use(superdebug(console.info, options))
```

```
DEBUG=logDebug,curlDebug node sdk.js
```

### Help
Refer to the example provided

### Improvement

1. Test/Test coverage report
3. CI/CD process

Any feedbacks or contributions are welcome!