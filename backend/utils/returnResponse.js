const response = function(statusCode, data, error, message) {
    return {
        statusCode: statusCode,
        data: data,
        error: error,
        message: message
    }
}

module.exports = response;