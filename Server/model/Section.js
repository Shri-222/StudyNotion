const mongoose = require('mongoose');

const sectionSchemas = new mongoose.Schema ({

    sectionName : {
        type: String,
    },

    subSection : [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Subsection',
        }
    ],


});

module.exports = mongoose.model('Section', sectionSchemas);