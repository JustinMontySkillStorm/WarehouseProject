const mongoose = require('mongoose');
require('dotenv').config();


/**
 * factory function to house connect and disconnet 
 * within the same object
 * 
 * @param {*} uri uri for your mongoDB instance 
 * @returns an object with connect and disconnet methods to your 
 * mongoDB instance
 */
const mongoFactory = (uri) => {
    const connect = async () => {
        await mongoose.connect(uri);
    }

    const disconnect = () => {
        mongoose.connection.close();
    }

    return {
        connect,
        disconnect,
    }
}

module.exports = mongoFactory;

