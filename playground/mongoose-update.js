const {ObjectID} = require('mongodb');

const { mongoose } = require('./../server/server');
const { TodoModel } = require('./../server/models/todo');
const { UserModel } = require('./../server/models/user');

var id = "59f9cae804a3923d22007bc2";
var valid = ObjectID.isValid(id);
if (!valid) {
    console.log("ID not valid");
}

