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
    method deleteMany
    */
    //db.collection('Todos').deleteMany({ text: "Go out" })
    //.then((result) => console.log(result));
    /*
      method deleteOne
    */
    //db.collection("Todos").deleteOne({ text: "duplicate" })
    //    .then((results) => console.log(results));
    /*
    method findOneAndDelete: useful e.g. if I have only the _id property
    */
    //db.collection("Todos").findOneAndDelete({ text: "duplicate 2" })
    //    .then((results) => console.log(results));

    /*
    Exercise deleteMany User documents and findAndDeleteOne id
    */
    var collection_users = db.collection('Users');
    //console.log(collection_users.find());
    collection_users.deleteMany({ name: 'Pepe Lotas' })
        .then((result) => console.log(result));
    collection_users.findOneAndDelete({ _id: new ObjectID('59eb95efe76b872c1d0fe9b3') })
        .then((result) => console.log(result));
    db.close();
});