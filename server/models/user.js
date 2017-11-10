const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var Schema = mongoose.Schema;
var UserSchema = new Schema({
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

/**Overwrites the toJSON method */
UserSchema.methods.toJSON = function () {
    user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var secret_value = "abc";
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, secret_value).toString();

    user.tokens.push({
        access,
        token
    });
    //this just returns a promise which can be chained witha new then()
    return user.save().then((result) => {
        return token;
    });
};

var User = mongoose.model('User', UserSchema);

module.exports = {User};