'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
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

var handleResponse = function handleResponse(request, start, logger, debugLog, debugCurl) {
    return function (response) {
        var now = new Date().getTime();
        var elapsed = now - start;
        var elapseTime = elapsed + 'ms';

        var uri = url.parse(request.url);
        var protocol = uri.protocol.toUpperCase().replace(/[^\w]/g, '');
        var requestMethod = request.method.toUpperCase();
        var responseStatus = response.status;

        var requestUrl = constructUrl(request.url, request.qs);
        var curl = mapRequestToCurl(request, requestUrl);

        debugCurl.apply(null, [chalk.gray(curl)]);

        debugLog.apply(null, ['%s %s %s %s %s', chalk.magenta(protocol), chalk.cyan(requestMethod), chalk[getColorByResponseStatus(responseStatus)](responseStatus), chalk.gray(requestUrl), chalk.gray('(') + chalk[getColorByResponseSpeed(elapsed)](elapseTime) + chalk.gray(')')]);
        logger(protocol + ' ' + requestMethod + ' ' + responseStatus + ' ' + requestUrl + ' (' + elapseTime + ')');
    };
};

exports.default = function () {
    var logger = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { logName: 'super-debug', curlName: 'super-curl' };
    return function (request) {
        var debugLog = _debug(options.logName);
        var debugCurl = _debug(options.curlName);

        var start = new Date().getTime();

        request.on('response', handleResponse(request, start, logger, debugLog, debugCurl));
    };
};