require('./../config/config');
/**Imports */
const express = require('express');
const body_parser = require('body-parser');
const mongoose = require('./db/mongoose').mongoose;
const _ = require('lodash');
const { ObjectID } = require('mongodb');
const { TodoModel } = require('./models/todo');
const { UserModel } = require('./models/user');
/**Routes and Handles */
var app = express();
const port = process.env.PORT;

mongoose.Promise = Promise;

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

app.post('/todos', (req, res) => {
    // console.log(req.body);
    var todo = new TodoModel({
        text: req.body.text
    });

    todo.save().then((result) => {
        res.status(200).json(result);
    }).catch((e) => res.status(400).send(e));
});

app.get('/todos', (req, res) => {
    TodoModel.find().then((result) => {
        res.json({ todos: result });
    }).catch((e) => res.status(400).send(e));
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    //validate id => 404 => empty body
    var valid = ObjectID.isValid(id);
    if (!valid) {
        res.status(404).json({ error_message: "ID is not valid" });
    } else {
        //query db success (todo vs !todo(404)) vs errorr (400)
        TodoModel.findById(id).then((todo) => {
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

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).json({ error_message: "ID is not valid" });
    }
    TodoModel.findByIdAndRemove(id).then((result) => {
        if (result === null) {
            res.status(404).json({ error_message: "Dataset not found" });
        } else {
            res.status(200).json({ deleted_todo: result });
        }
    }).catch((err) => {
        res.status(400).send(error);
    })

});

app.patch('/todos/:id', (req , res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).json({ error_message: "ID is not valid" });
    }
    var body = _.pick(req.body, ['text', 'completed', 'completedAt']);
    if(_.isBoolean(body.completed) && body.completed === true){
        body.completedAt = new Date().getTime();
    }else{
        body.completed =false;
        body.completedAt = null;
    }

    TodoModel.findByIdAndUpdate(id, {$set:body}, {new:true})
    .then((result)=>{
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
    var user = new UserModel(body);

    user.save().then((result) => {
        res.status(200).json(result);
    }).catch((e) => res.status(400).send(e));
});
app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = { app };
