const mongoose = require('mongoose');
const { FieldsOnCorrectTypeRule } = require('graphql');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    createdProfiles: [
        {
            type: Schema.Types.ObjectId, 
            ref: 'CharProfile'
        }
    ]
});

module.exports = mongoose.model('User', userSchema);
