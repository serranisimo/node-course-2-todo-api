const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var userSchema = new Schema({
    email:{
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
});

var UserModel = mongoose.model('User', userSchema);

module.exports = {UserModel};