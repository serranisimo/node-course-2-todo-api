//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

//var id = new ObjectID();
//console.log(id);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        //In MongoDB it is not necessary to create a DB before starting using it
        //A DB in Mongo is not created until we start adding data into it
        return console.log("Unable to connect to MongoDB server...");
    }
    console.log('Connected to MongoDB successfully...');
    //db.collection('Todos').insertOne({
    //    text: 'Something to do...',
    //    completed: false
    //}, (err, result) => {
    //    if (err) {
    //        return console.log('Unable to insert Todo');
    //    }
    //    console.log(JSON.stringify(result.ops, undefined, 2));
    //});
    //db.collection('Users').insertOne({
    //    name: 'Pepe Lotas',
    //    age: 35,
    //    location: 'Kai'
    //}, (err, result) => {
    //    if (err) {
    //        return console.log('Unable to insert user', err);
    //    }
    //    console.log(JSON.stringify(result.ops[0]._id, undefined, 2));
    //});
    db.close()
});