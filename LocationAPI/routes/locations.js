var express = require('express');
var router = express.Router();
var jsonParser = express.json();
const mongoClient = require('mongodb').MongoClient;

// get the nearest 3 locations to my current location
router.get('/nearest', function (req, res, next) {

    const currentLocation = [-91.9665342, 41.017654];


    // connect to mongo db
    mongoClient.connect('mongodb://127.0.0.1:27017/lab8db', (err, client) => {

        if (err)
            throw err;

        const db = client.db('lab8db');

        db.collection('locations').createIndex({ 'location': '2dsphere' });
        db.collection('locations').find({location:{$near: {$geometry:{coordinates: currentLocation }}}}).project( {category:1, name:1}).limit(3).toArray((err, doc) => {
       // db.collection('locations').find({location: { $near: currentLocation }}).limit(3).toArray((err, doc) => {
            console.log(doc);

            res.json(doc);
            res.end();

        }); 



    });

});

// get all locations
router.get('/', function (req, res, next) {

    // connect to mongo db
    mongoClient.connect('mongodb://127.0.0.1:27017/lab8db', (err, client) => {

        if (err)
            throw err;

        const db = client.db('lab8db');

        // get the message from homework collection
        db.collection('locations').find({}).toArray((err, doc) => {
            console.log(doc);

            res.json(doc);
            res.end();

        })
    })


});


// insert location to database
router.post('/', function (req, res, next) {

    // connect to mongo db
    mongoClient.connect('mongodb://127.0.0.1:27017/lab8db', (err, client) => {

        if (err)
            throw err;

        const db = client.db('lab8db');

        // insert to db
        db.collection('locations').insert(req.body, function (err, docInserted) {
            if (err)
                throw err;

            res.json("SUCCESS");
        })
    })


});


router.delete('/:name', function (req, res, next) {

    let name = req.params['name'];

    // connect to mongo db
    mongoClient.connect('mongodb://127.0.0.1:27017/lab8db', (err, client) => {

        if (err)
            throw err;

        const db = client.db('lab8db');

        var query = { 'name': name }
        // insert to db
        db.collection('locations').remove(query, function (err, removed) {
            if (err)
                throw err;

            res.json("SUCCESS");
        })
    })


});


module.exports = router;