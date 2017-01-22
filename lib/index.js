'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (request) {
    var logger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
        logName: 'super-debug',
        curlName: 'super-curl'
    };

    var debugLog = _debug(options.logName);
    var debugCurl = _debug(options.curlName);

    var requestUrl = constructUrl(request.url, request.qs);
    var curl = mapRequestToCurl(request, requestUrl);
    debugCurl.apply(null, [chalk.gray(curl)]);

    var start = new Date().getTime();
    var uri = url.parse(request.url);

    request.on('response', function (response) {
        var now = new Date().getTime();
        var elapsed = now - start;
        var protocol = uri.protocol.toUpperCase().replace(/[^\w]/g, '');
        var requestMethod = request.method.toUpperCase();
        var responseStatus = response.status;
        var elapseTime = elapsed + 'ms';

        debugLog.apply(null, ['%s %s %s %s %s', chalk.magenta(protocol), chalk.cyan(requestMethod), chalk[getColorByResponseStatus(responseStatus)](responseStatus), chalk.gray(requestUrl), chalk.gray('(') + chalk[getColorByResponseSpeed(elapsed)](elapseTime) + chalk.gray(')')]);
        logger(protocol + ' ' + requestMethod + ' ' + responseStatus + ' ' + requestUrl + ' (' + elapseTime + ')');
    });
};

var reduce = require('lodash/reduce');
var isEmpty = require('lodash/isEmpty');
var queryString = require('query-string');
var chalk = require('chalk');
var url = require('url');
var _debug = require('debug');
var moment = require('moment');

var appendQuery = function appendQuery(qs) {
    if (!isEmpty(qs)) {
        return '?' + queryString.stringify(qs);
    }
    return '';
};

var constructUrl = function constructUrl(url) {
    var qs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return url + appendQuery(qs);
};

var mapRequestToCurl = function mapRequestToCurl(request, requestUrl) {
    var headers = reduce(request.header, function (headers, value, header) {
        return headers + ('-H \'' + header + ': ' + value + '\' ');
    }, ' ');
    return 'curl -v -X ' + request.method + headers + requestUrl;
};

var getColorByResponseStatus = function getColorByResponseStatus(status) {
    if (status < 300) {
        return 'green';
    } else if (status < 400) {
        return 'yellow';
    }
    return 'red';
};

var getColorByResponseSpeed = function getColorByResponseSpeed(ms) {
    if (ms < 200) {
        return 'green';
    } else if (ms < 1000) {
        return 'magenta';
    } else if (ms < 5000) {
        return 'yellow';
    }
    return 'red';
};