const { Logger } = require("../utils");

const logger = Logger(__filename)

const logger_middleware = function (req, res, next){
    logger.info(`Requested method :: ${req.method}`);
    logger.info(`Requested url :: ${req.url}`)
    next();
}

module.exports = logger_middleware;