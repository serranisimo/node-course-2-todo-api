require('./../config/config');
/**Imports */
const express = require('express');
const body_parser = require('body-parser');
const mongoose = require('./db/mongoose').mongoose;
const _ = require('lodash');
const { ObjectID } = require('mongodb');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
/**Routes and Handles */
var app = express();
const port = process.env.PORT;
var { authenticate } = require('./middleware/authenticate');

mongoose.Promise = Promise;

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

app.post('/todos', authenticate, (req, res) => {
    // console.log(req.body);
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((result) => {
        res.status(200).json(result);
    }).catch((e) => res.status(400).send(e));
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((result) => {
        res.json({ todos: result });
    }).catch((e) => res.status(400).send(e));
});

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    //validate id => 404 => empty body
    var valid = ObjectID.isValid(id);
    if (!valid) {
        res.status(404).json({ error_message: "ID is not valid" });
    } else {
        //query db success (todo vs !todo(404)) vs errorr (400)
        Todo.findOne({
            _id: new ObjectID(id),
            _creator: req.user._id
        }).then((todo) => {
            //console.log("Requested item:\n", todo);
            if (todo === null) {
                res.status(404).json({ error_message: "No maches found" });
            } else {
                res.json({ todo: todo });
            }
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
});

app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).json({ error_message: "ID is not valid" });
    }
    Todo.findOneAndRemove({
        _id: new ObjectID(id),
        _creator: req.user._id
    }).then((result) => {
        if (result === null) {
            res.status(404).json({ error_message: "Dataset not found" });
        } else {
            res.status(200).json({ deleted_todo: result });
        }
    }).catch((err) => {
        res.status(400).send(error);
    });

});

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).json({ error_message: "ID is not valid" });
    }
    var body = _.pick(req.body, ['text', 'completed', 'completedAt']);
    if (_.isBoolean(body.completed) && body.completed === true) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: new ObjectID(id),
        _creator: req.user._id
    }, { $set: body }, { new: true })
        .then((result) => {
            if (result === null) {
                res.status(404).json({ error_message: "Dataset not found" });
            } else {
                res.status(200).json({ todo: result });
            }
        }).catch((err) => {
            res.status(400).send(error);
        })
});

// POST /users
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save()
        .then((result) => {
            return user.generateAuthToken();
        }).then((token) => {
            res.status(200).header('x-auth', token).json(user);
        }).catch((e) => res.status(400).send(e));
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

//POST /users/login {email, password}
/** send back body data */
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.status(200).header({ "x-auth": token }).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});
app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = { app };
