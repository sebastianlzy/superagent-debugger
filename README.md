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
curl -v -X GET -H 'User-Agent: node-superagent/3.1.0' -H 'Accept: application/json' -H 'Content-Type: application/json' -H 'X-Shopback-Country: SG' -H 'X-Shopback-Domain: www.shopback.sg' -H 'X-Shopback-Language: en' -H 'X-Shopback-Agent: sbconsumeragent/1.0' -H 'X-Shopback-Internal: 682a46b19b953306c9ee2e8deb0dc210' -H 'X-Request-Id: 5f075904-7c1b-4ad3-ad78-20fdf0a25288' http://gateway.shopback.com/int/accounts/2630533/cashbacks?isValid=1&statuses=Pending%2CRedeemable%2CBonus%2CProcessing%2CPaid","timestamp":"2017-01-22T13:44:23.498Z
HTTP GET 200 http://gateway.shopback.com/int/accounts/2630533/payment?include=paymentType (89ms)","timestamp":"2017-01-22T13:44:23.585Z
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