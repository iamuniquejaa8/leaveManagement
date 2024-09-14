const dotenv = require("dotenv")
const express = require("express");
const cors = require("cors");

const { config } = require("./config");
const { apiLogger } = require("./middleware");
const { Logger, dbConnect } = require("./utils")
const { leaveRouter, partnerRouter } = require("./router");

const app = express();
const port = config.port;
const logger = Logger(__filename);
dotenv.config()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(apiLogger);

app.use('/leave', leaveRouter);
app.use('/partner', partnerRouter);

dbConnect().then((success)=>{
    logger.info(success);

    app.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
    });    

}).catch((err)=>{
    logger.error(err);
})