const mongoose = require('mongoose');

const courseSchemas = new mongoose.Schema ({

    courseName : {
        type : String,
        required : true,
        trim : true,
    },

    courseDiscription : {
        type : String,
        required : true,
        trim : true,
    },

    professor : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        trim : true,
    },

    whatYouWillLearn : {
        type : String,
        required : true,
        trim : true,
    },
    
    courseContent : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Section',
            required : true,
            trim : true,
        }
    ],

    ratingAcndRewivw : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'RatingAndRewive',
            required : true,
            trim : true,
        }
    ],

    price : {
        type : Number,
        required : true,
        trim : true,
    },

    thumbnail : {
        type : String,
        required : true,
    },

    Tags : {
        type : String,
        required : true,
        trim : true,
    },

    Categary : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Categary',
        required : true,
        trim : true,
    },

    studentEnroll : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : true,
        }
    ],

});


module.exports = mongoose.model('Course', courseSchemas);