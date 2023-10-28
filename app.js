const express = require('express')
const { ObjectId } = require('mongodb')
const { connectToDb, getDb } = require('./db')

// init app & middleware
const app = express()
app.use(express.json())

// db connection
let db

connectToDb((err) => {
    if(!err){
        app.listen(3000, () => {
            console.log("app listening on port 3000")
        })
        db = getDb()        
    }
})

// routes
app.get('/books', (req,res) => {
    //current page
    const page = req.query.p || 0
    const booksPerPage = 3

    let books = []

    db.collection('books')
        .find()  //cursor toArray forEach // find returns a cursor! points to subset of documents
        //first batch of doc max is 101. limit to avoid network flooding.
        .sort({ author:1 }) //returns cursor
        .skip(page * booksPerPage)
        .limit(booksPerPage)
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books)
        })
        .catch(() => {
            res.status(500).json({error: 'Could not fetch the documents'})
        })
})

app.get('/books/:id', (req,res) => {

    if(ObjectId.isValid(req.params.id)){
        const objectId = new ObjectId(req.params.id)
        db.collection('books')
            .findOne({_id : objectId})
            .then(doc => {
                res.status(200).json(doc)
            })
            .catch(err => {
                res.status(500).json({error: 'Could not fetch the document'})
            })
    }
    else{
        res.status(500).json({error: 'Not a valid doc id'})
    }
})


app.post('/books',(req,res) => {
    const book = req.body

    db.collection('books')
        .insertOne(book)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({err: 'Could not create a new document'})
        })
})

app.delete('/books/:id', (req,res) => {

    if(ObjectId.isValid(req.params.id)){
        const objectId = new ObjectId(req.params.id)
        db.collection('books')
            .deleteOne({_id : objectId})
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({error: 'Could not delete the document'})
            })
    }
    else{
        res.status(500).json({error: 'Not a valid doc id'})
    }
})

app.patch('/books/:id',(req,res) => {
    const updates = req.body //object
    // {title:"value",age:30} // this is how updates looks like!

    if(ObjectId.isValid(req.params.id)){
        const objectId = new ObjectId(req.params.id)
        db.collection('books')
            .updateOne({_id : objectId},{$set: updates})
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({error: 'Could not update the document'})
            })
    }
    else{
        res.status(500).json({error: 'Not a valid doc id'})
    }
})