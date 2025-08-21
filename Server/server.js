
const app = require('./app');
const database = require('./config/database');
const { cloudinaryConnect } = require('./config/cloudinary');

const PORT = process.env.PORT || 8080 ;

async function startServer() {
    await database.connect();
    await cloudinaryConnect();
};

startServer().catch(err => {
    console.log('Error starting Server: ', err);
    process.exit(1);
})