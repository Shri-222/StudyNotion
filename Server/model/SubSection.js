const mongoose = require('mongoose');

const subSectionSchema = new mongoose.Schema ({

    Title : {
        type : String,
        trim : true,
    },

    TimeDuration : {
        type : String,
    },

    discription : {
        type : String,
        trim : true,
    },

    VideoUrl : {
        type : String
    },

});

module.exports =mongoose.model('SubSection', subSectionSchema);