const mongoose = require('mongoose');
require('dotenv').config();


exports.connect = () => {
    mongoose.connect(process.env.MONGOODB_URL, {
          useNewUrlParser : true,
          useUnifiedTopology : true,
    })

    .then(() => console.log("Databse Connected Successfully"))
    .catch((error) => {
        console.log("Error While Connecting to DataBase");
        console.error(error);
        process.exit(1);
    })
};