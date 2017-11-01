const {ObjectID} = require('mongodb');

const { mongoose } = require('./../server/server');
const { TodoModel } = require('./../server/models/todo');
const { UserModel } = require('./../server/models/user');

var id = "59f9cae804a3923d22007bc2";
var valid = ObjectID.isValid(id);
if (!valid) {
    console.log("ID not valid");
}

//TodoModel.find({ _id: id }).then((todos) => {
//    if (todos.length === 0) return console.log("No maches found");
//    console.log('Todos', todos);
//});

//TodoModel.findOne({ _id: id }).then((todo) => {
//    if (todo === null) return console.log("No maches found");
//    console.log('Todo', todo);
//}).catch((e)=> console.log(e));
//TodoModel.findById(id).then((todo) => {
//    if (todo === null) return console.log("No maches found");
//    console.log('Todo', todo);
//}).catch((e) => console.log(e));

UserModel.findById(id).then((todo) => {
    if (todo === null) return console.log("No maches found");
    console.log('Todo', todo);
}).catch((e) => console.log(e));

