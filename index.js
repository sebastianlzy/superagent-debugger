let reduce = require('lodash/reduce');
let isEmpty = require('lodash/isEmpty');
let queryString = require('query-string');
let chalk = require('chalk');
let url = require('url');
let _debug = require('debug');
let moment = require('moment');

const appendQuery = (qs) => {
    if (!isEmpty(qs)) {
        return `?${queryString.stringify(qs)}`;
    }
    return '';
};

const constructUrl = (url, qs = {}) => (
    url + appendQuery(qs)
);

const mapRequestToCurl = (request, requestUrl) => {
    const headers = reduce(request.header, (headers, value, header) => headers + `-H '${header}: ${value}' `, ' ');
    return `curl -v -X ${request.method}${headers}${requestUrl}`;
};

const getColorByResponseStatus = (status) => {
    if (status < 300) {
        return 'green';
    } else if (status < 400) {
        return 'yellow';
    }
    return 'red';
};

const getColorByResponseSpeed = (ms) => {
    if (ms < 200) {
        return 'green';
    } else if (ms < 1000) {
        return 'magenta';
    } else if (ms < 5000) {
        return 'yellow';
    }
    return 'red';
};

const log = (debug, value, logger) => {
    if(logger) {
        logger.apply(value);
    }

}

export default function (request, logger = null, logName = 'super-log', curlName ='super-curl') {
    const debugLog = _debug(logName);
    const debugCurl = _debug(curlName);

    const requestUrl = constructUrl(request.url, request.qs);
    const curl = mapRequestToCurl(request, requestUrl);
    debugCurl.apply(chalk.gray(curl));

    const start = new Date().getTime();
    const uri = url.parse(request.url);

    request.on('response', function (response) {
        const now = new Date().getTime();
        const elapsed = now - start;
        const protocol = uri.protocol.toUpperCase().replace(/[^\w]/g, '');
        const requestMethod = request.method.toUpperCase();
        const responseStatus = response.status;
        const elapseTime = elapsed + 'ms';

        debugLog.apply(null, [
            '%s %s %s %s %s',
            chalk.magenta(protocol),
            chalk.cyan(requestMethod),
            chalk[getColorByResponseStatus(responseStatus)](responseStatus),
            chalk.gray(requestUrl),
            chalk.gray('(') + chalk[getColorByResponseSpeed(elapsed)](elapseTime) + chalk.gray(')')
        ])
        logger(`${protocol} ${requestMethod} ${responseStatus} ${requestUrl} (${elapseTime})`)
    });
}