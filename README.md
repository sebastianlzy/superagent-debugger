# Simple Log For Super Agent 

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
let superdebug = require('../lib/index').default;

let request = superagent('GET', 'http://localhost:3000/debug')

request
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
    
 request
     .set({Accept: 'application/json'})
     .query({superdebug: 'is-awesome'})
     .use(superdebug(console.info, options))
```

```
DEBUG=logDebug,curlDebug node sdk.js
```