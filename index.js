let reduce = require("lodash/reduce");
let isEmpty = require("lodash/isEmpty");
let queryString = require("query-string");
let get = require("lodash/get");
let chalk = require("chalk");
let url = require("url");
let _debug = require("debug");
let moment = require("moment");

const appendQuery = qs => {
  if (!isEmpty(qs)) {
    return `?${queryString.stringify(qs)}`;
  }
  return "";
};

export const constructUrl = (url, qs = {}) => url + appendQuery(qs);

const formatRequestData = requestData => {
  if (requestData) {
    try {
      return `-d '${JSON.stringify(requestData)}' `;
    } catch (e) {
      return "";
    }
  }
  return "";
};

export const mapRequestToCurl = (request, requestUrl) => {
  const headers = reduce(
    request.header,
    (headers, value, header) => headers + `-H '${header}: ${value}' `,
    " "
  );
  let requestData = formatRequestData(get(request, "_data", false));

  return `curl -v -X ${request.method}${headers}${requestData}${requestUrl}`;
};

export const getColorByResponseStatus = status => {
  if (status < 300) {
    return "green";
  } else if (status < 400) {
    return "yellow";
  }
  return "red";
};

export const getColorByResponseTime = ms => {
  if (ms < 200) {
    return "green";
  } else if (ms < 1000) {
    return "magenta";
  } else if (ms < 5000) {
    return "yellow";
  }
  return "red";
};

const handleResponse = (
  request,
  start,
  logger,
  debugLog,
  debugCurl
) => response => {
  const now = new Date().getTime();
  const elapsed = now - start;
  const elapseTime = elapsed + "ms";

  const uri = url.parse(request.url);
  const protocol = uri.protocol.toUpperCase().replace(/[^\w]/g, "");
  const requestMethod = request.method.toUpperCase();
  const responseStatus = response.status;

  const requestUrl = constructUrl(request.url, request.qs);
  const curl = mapRequestToCurl(request, requestUrl);

  debugCurl.apply(null, [chalk.gray(curl)]);
  logger(curl);

  debugLog.apply(null, [
    "%s %s %s %s %s",
    chalk.magenta(protocol),
    chalk.cyan(requestMethod),
    chalk[getColorByResponseStatus(responseStatus)](responseStatus),
    chalk.gray(requestUrl),
    chalk.gray("(") +
      chalk[getColorByResponseTime(elapsed)](elapseTime) +
      chalk.gray(")")
  ]);
  logger(
    `${protocol} ${requestMethod} ${responseStatus} ${requestUrl} (${elapseTime})`
  );
};

export default (
  logger = null,
  options = { logName: "super-debug", curlName: "super-curl" }
) => request => {
  const debugLog = _debug(options.logName);
  const debugCurl = _debug(options.curlName);

  const start = new Date().getTime();

  request.on(
    "response",
    handleResponse(request, start, logger, debugLog, debugCurl)
  );
};
