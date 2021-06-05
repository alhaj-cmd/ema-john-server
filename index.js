const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cc38m.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 4000



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log(err)
  const productsCollection = client.db("emaStore").collection("products");
  const orderCollection = client.db("emaStore").collection("order");
  
  app.post('/addProduct', (req,res) => {
      const products = req.body;
     // console.log(product)
      productsCollection.insertOne(products)
      .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount)
      })
  })
  app.get('/products', (req,res) => {
    productsCollection.find({}).limit(20)
    .toArray( (err, documents) => {
      res.send(documents)
    })
  })

  app.get('/product:key', (req,res) => {
    productsCollection.find({key: req.params.key})
    .toArray( (err, documents) => {
      res.send(documents[0])
    })
  })

  app.post('/productBykeys', (req, res) =>{
    const productKeys = req.body;
    productsCollection.find({key:{$in:productKeys}})
    .toArray((err,documents) =>{
      res.send(documents);
    })
  })

  app.post('/addOrder', (req,res) => {
    const order = req.body;
   // console.log(product)
    orderCollection.insertOne(order)
    .then(result => {
     // console.log(result.insertedCount);
      res.send(result.insertedCount > 0)
    })
})

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



