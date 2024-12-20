const mongoose = require('mongoose');

const userSchema = new mongoose.Schema ({

    FirstName: {
        type : String,
        required : true,
        trim : true,
    },

    LastName: {
        type :String,
        required : true,
        trim : true,
    },

    contactNumber : {
        type : Number,
        trim : true,
        // match : /^(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/
    },
    
    email: {
        type : String,
        required : true,
        trim : true,
        unique : true,
        // match : /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },

    password: {
        type : String,
        required : true,
        // trim : true,
        // minlength : 8,
        // match : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    }, 

    confirmPassword: {
        type : String,
        // required : true,
        trim : true,
        // match : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    },

    accountType : {
        type : String,
        required : true,
        enum : ['Student', 'Professor', 'Admin'],
    },

    additionalDetails : {
        type : mongoose.Schema.Types.ObjectId,
        // required : true,
        ref : 'ProfileSchema',
    },

    courses : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Course',
    }],

    image : {
        type : String,
        require : true,
    },

    courseProgress : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'CourseProgress',
    },

    changePasswordToken : {
        type : String,
        trim : true,
    },

    changePasswordExpires : {
        type : Date,
    },



});






module.exports = mongoose.model('User', userSchema);