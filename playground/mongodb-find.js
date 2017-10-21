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

    //db.collection('Todos').find({
    //    //completed: false
    //    _id: new ObjectID("59e78c3485a23b27e043ce07")
    //}).toArray()
    //    .then((docs) => {
    //        console.log(JSON.stringify(docs, undefined,2));
    //    }).catch((err) => {
    //        console.log(err);
    //    });

    //db.collection('Todos').find({
    //    //completed: false
    //    //_id: new ObjectID("59e78c3485a23b27e043ce07")
    //}).count((err, result) => {
    //    if (err) {
    //        console.log(err);
    //    } else {
    //        console.log(result);
    //    }
    //    });

    //db.collection('Todos').find({
    //    //completed: false
    //    //_id: new ObjectID("59e78c3485a23b27e043ce07")
    //}).count().then((count) => console.log(`Number of documents: ${count}`))
    //    .catch((err) => console.log(err));
    var cursor = db.collection('Users').find({
        name: 'Pepe Lotas'
    });

    cursor.toArray()
        .then((docs) => {
            console.log(JSON.stringify(docs, undefined,2));
        }).catch((err) => {
            console.log(err);
        });

    cursor.count().then((count) => console.log(`Number of documents: ${count}`))
        .catch((err) => console.log(err));
    db.close()
});