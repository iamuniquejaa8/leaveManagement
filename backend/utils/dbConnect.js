const mongoose = require('mongoose');
const Logger = require("./logger");
const { config } = require('../config');
 
const MONGOURI = config.mongo_uri;

const InitiateMongoServer = async function(){
    return new Promise((resolve, reject) => {
        try {
            mongoose.connect(MONGOURI);
            resolve({
                message: "Connection to Database established!"
            })
        } catch (error) {
            reject({
                message: "Error in connecting to database!"
            })
        }
    })
}

module.exports = InitiateMongoServer;