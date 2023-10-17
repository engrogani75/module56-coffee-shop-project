const express = require('express')
const cors =  require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000



app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.d33r4qq.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db('coffeeDB');
    const coffee = coffeeCollection.collection('coffee')
  

    app.post('/coffee', async(req, res) =>{
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffee.insertOne(newCoffee)
      console.log(result);
     res.send(result)
    })


    app.get('/coffee', async(req,res) =>{
      const cursor = coffee.find();
      const result = await cursor.toArray();
      res.send(result)
    })


    app.get('/coffee/:id', async(req, res) =>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await coffee.findOne(query)
      res.send(result)
    })


    app.delete('/coffee/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffee.deleteOne(query)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



console.log(process.env.DB_USER);
console.log(process.env.DB_KEY);






app.get('/', (req, res) => {
  res.send('This is coffee Store')
})

app.listen(port, () => {
  console.log(`Coffee Server is running on port ${port}`)
})

