const mongoose = require('mongoose');

const CategarySchema = new mongoose.Schema({

    name : {
        type : String,
        required : true,
    },

    discription : {
        type : String,
        required : true,
        trim : true,
    },

    courses : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Course',
            required : true,
            trim : true,
        }
    ],
        
        
});


module.exports = mongoose.model('Categary', CategarySchema);