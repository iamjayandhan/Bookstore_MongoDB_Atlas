const { MongoClient } = require('mongodb')
 
let dbConnection

//MongoDB atlas url!
//use the right url
// let uri = 'mongodb+srv://<username>:<password>@cluster0.fyjqphu.mongodb.net/?retryWrites=true&w=majority'
let localuri = "mongodb://127.0.0.1:27017/bookstore"

module.exports = {
    //Establish conn to db
    //cb - callback function
    connectToDb: (cb) => {
        MongoClient.connect(localuri)
        .then((client) => {
            dbConnection = client.db()
            return cb()
        })
        .catch(err => {
            console.log(err)
            return cb(err)
        })
    },
    //Return conn to db
    getDb: () => dbConnection
}