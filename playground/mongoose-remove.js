const {ObjectID} = require('mongodb');

const { mongoose } = require('./../server/server');
const { TodoModel } = require('./../server/models/todo');
const { UserModel } = require('./../server/models/user');

var result;
/*removes everything*/
//TodoModel.remove({});

/*removes the first found element*/
TodoModel.findOneAndRemove({ completed: true }).then((result) => console.log(result));

/*remove by ID*/
//TodoModel.findByIdAndRemove("59fa08d003e6792bd00b65f3").then((result) => console.log(result));

