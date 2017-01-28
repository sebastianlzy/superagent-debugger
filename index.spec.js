let assert = require('assert');
let superdebug = require("./index");
let expect = require('chai').expect;
let sinon = require('sinon')
let EventEmitter = require('events').EventEmitter;

describe('index.js', function() {
    describe('constructUrl()', function() {
        it('should construct the appropriate url given a query object', () => {
            let url = superdebug.constructUrl('http://gateway.me', {apple: 'red', pear: 'green'})
            expect(url).to.equal('http://gateway.me?apple=red&pear=green')
        });

        it('should form the required curl command to replicate the request', () => {
            const request = {
                header: {
                    'Accept': 'application/json'
                },
                method: 'GET'
            }
            let url = superdebug.mapRequestToCurl(request, 'http://gateway.me?apple=red&pear=green')
            expect(url).to.equal("curl -v -X GET -H 'Accept: application/json' http://gateway.me?apple=red&pear=green");
        })

        it('should return the correct color based on response status', () => {
            expect(superdebug.getColorByResponseStatus(500)).to.equal('red');
            expect(superdebug.getColorByResponseStatus(302)).to.equal('yellow');
            expect(superdebug.getColorByResponseStatus(201)).to.equal('green');
        })

        it('should return the correct color based on response time', () => {
            expect(superdebug.getColorByResponseTime(199)).to.equal('green');
            expect(superdebug.getColorByResponseTime(999)).to.equal('magenta');
            expect(superdebug.getColorByResponseTime(2778)).to.equal('yellow');
            expect(superdebug.getColorByResponseTime(5001)).to.equal('red');
        })

        it('should handle request response appropriately', () => {
            let request = new EventEmitter();
            let spy = sinon.spy()
            let debug = superdebug.default(spy);

            let url = {
                protocol: 'http',
                host: 'gateway.me',
                pathname: '/sebastian',
                url: 'http://gateway.me/sebastian',
                method: 'get'

            }
            debug(Object.assign(request, url))
            request.emit('response', {status: '200'})
            sinon.assert.calledTwice(spy);
        })
    });
});