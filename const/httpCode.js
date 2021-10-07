/**
 * Created by KaSha on 2017. 4. 10..
 */

function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable : true,
    });
}

function getMessage(key) {
    return exports.HTTP_CODE[key];
}

function getResponseBody (err_code, rows) {

    var result = {
        responseStatus : err_code,
        responseMsg : getMessage(err_code),
        data : rows
    };

    return result;
}

define("HTTP_CODE", {
    200:"Success",
    204: "Not exist contents",
    400: "Wrong request",
    401: "Incorrect Auth",
    403: "Forbidden",
    404: "Page not found",
    405: "Not allow request",
    406: "Not allow contents",
    500: "Internal Server Error"
});

exports.getResponseBody = getResponseBody;