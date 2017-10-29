var express = require('express');
var body_parser = require('body-parser');
var mongoose = require('./db/mongoose').mongoose;
var {TodoModel} = require('./models/todo');
var {UserModel} = require('./models/user');

var app = express();
var PORT = process.env.PORT || 3000;

mongoose.Promise = Promise;

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended:false}));

app.post('/todos', (req, res) =>{
   console.log(req.body); 
   var todo = new TodoModel({
       text : req.body.text
   });

   todo.save().then((result)=>{
    res.status(200).json(result);
   }).catch((e)=> res.status(400).send(e));
});

app.get('/todos', (req, res) => {
    TodoModel.find().then((result) => {
        res.json({todos: result});
    }).catch((e) => res.status(400).send(e));
});

app.listen(PORT, () => {
    console.log(`Started on port ${PORT}`);
});

module.exports = { app };
