const mongoose = require('mongoose');
const validator = require('validator');

var Schema = mongoose.Schema;
var userSchema = new Schema({
    email:{
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail, 
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }, tokens: [{
            access: {
                type: String,
                required: true
            }, 
            token: {
                type: String,
                required: true

            }
        }
    ]
});

var UserModel = mongoose.model('User', userSchema);

module.exports = {UserModel};