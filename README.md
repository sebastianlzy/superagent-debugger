# Simple Log For Super Agent 

### Introduction
An easy and fast way to identify and replicate rogue request on the fly 

### Dependencies
Logging for [superagent](https://github.com/visionmedia/superagent)

-----------
### Install

```cli
npm install --save super-log

```

### Usage

```js
import superagent from 'superagent';
import superdebug from 'superagent-debugger';
import EventEmitter from 'events';

const eventEmitter = new EventEmitter();
const request = superagent(httpMethod, url);

request.set(headers)
        .query(query)
        .timeout(defaultTimeout)
        .send(data);

eventEmitter.emit('sendRequest', request);

eventEmitter.on('sendRequest', (request) => {
    superDebug(request, console.info);
});

```

### Output Log
```log
curl -v -X GET -H 'User-Agent: node-superagent/3.1.0' -H 'Accept: application/json' -H 'Content-Type: application/json' http://gateway.me/sebastian","timestamp":"2017-01-22T13:44:23.498Z
HTTP GET 200 http://gateway.me/sebastian (89ms)","timestamp":"2017-01-22T13:44:23.585Z
```

### Using Debug
 `DEBUG=super-curl,super-debug npm run server:watch`
 
![screeshot1](/sample-log.jpg)

### options

```js
 eventEmitter.on('sendRequest', (request) => {
        superdebug(request, logger.info, {
            logName: 'SDK',
            curlName: 'CURL'
        });
    });
```