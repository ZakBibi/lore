const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const charProfileSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    eyeColour: {
        type: String, 
        required: true
    },
    hairColour: {
        type: String, 
        required: true
    },
    history: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('charProfile', charProfileSchema);
