
const express = require('express');
const app = express();

const userRouts = require('./routes/User');
const profileRouts = require('./routes/Profile');
const courseRouts = require('./routes/Courses');
const paymentRouts = require('./routes/Payment');

const database = require('./config/database');
const {cloudinaryConnect} = require('./config/cloudinary');

const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUploder = require('express-fileupload');
require('dotenv').config();

const PORT = process.env.PORT || 4000;

// middleware

app.use(express.json());

app.use(cors(
    {
        origin : 'https://localhost:3000',
        credentials : true,
    }
));

app.use(cookieParser());

app.use(fileUploder(
    {
        useTempFiles : true,
        tempFileDir : '/tmp'
    }
));


// routs 

app.use('/api/v1/users', userRouts);
app.use('/api/v1/profile', profileRouts);
app.use('/api/v1/courses', courseRouts);
app.use('/api/v1/payment', paymentRouts);

// connect to database

database.connect();

// cloudinary

cloudinaryConnect();

app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`);
});