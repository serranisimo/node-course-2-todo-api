const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const idOne = new ObjectID();
const idTwo = new ObjectID();
var access = 'auth';
const users = [{
    _id: idOne,
    email: 'test1@tester.com',
    password: 'abc123',
    tokens: [
        {
            access,
            token: jwt.sign(
                {
                    _id: idOne.toHexString(), 
                    access: 'auth'
                }, "abc").toString()
        }
    ]
}, {
    id: idTwo,
    email: 'test2@tester.com',
    password: 'abc124',

}];
const todos = [{
    _id: new ObjectID(),
    text: 'First Todo'
}, {
    _id: new ObjectID(),
    text: 'Second Todo',
    completed: true,
    completedAt: 333
}];

const populateTodos = (done) => {
    Todo.remove({}).then(()=>{
        Todo.insertMany(todos);
    }).then((result) => 
    {
        // todos[1].completedAt = result.completedAt;
        done()
    });
};

const populateUsers = (done) =>{
    User.remove({})
    .then(()=>{
        var user_one = new User(users[0]).save();
        var user_two = new User(users[1]).save();
        return Promise.all([user_one, user_two])
        .then(()=> {
            done();
        });
    }).catch((e)=>{
        console.log(e);
    });
};

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
};