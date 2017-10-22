//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        //In MongoDB it is not necessary to create a DB before starting using it
        //A DB in Mongo is not created until we start adding data into it
        return console.log("Unable to connect to MongoDB server...");
    }
    console.log('Connected to MongoDB successfully...');

    /*
    findOneAndUpdate
    */
    //db.collection('Todos').findOneAndUpdate(
    //    {
    //        //_id: new ObjectID('59ea2b4b2921be10d5e4f8c2')
    //        text: "Something to do...",
    //    }, 
    //    {
    //        $set: {
    //            completed: true
    //        }
    //    },
    //    {
    //        returnOriginal: false
    //    }).then((result) => {
    //        console.log(result);
    //    });
    db.collection('Users').findOneAndUpdate(
        { name: "Alvaro Serrano Arias" },
        {
            $set: {
                name: "Alvaro Serrano-Arias"
            },
            $inc: {
                age: 1
            }
        }
    ).then((result) => console.log(result));
    db.close();
});