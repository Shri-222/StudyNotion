const mongoose = require('mongoose');
require('dotenv').config();

const MONGOODB_URL = 'mongodb://127.0.0.1:27017/STUDY-NOTION';

exports.connect = async () => {
    const conn = await mongoose.connect(MONGOODB_URL)

    .then(() => console.log("Databse Connected Successfully"))
    .catch((error) => {
        console.log("Error While Connecting to DataBase");
        console.error(error);
        process.exit(1);
    })
};