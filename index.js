const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3zae4eg.mongodb.net/?retryWrites=true&w=majority`;


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

    const userCollection = client.db('photographyDb').collection("users");
    const classCollection = client.db('photographyDb').collection("class");
    const selectedCollection = client.db('photographyDb').collection("selected");

    //user api collection
    app.post('/users', async(req,res) => {
      const user = req.body;
      const query = {email:user.email}
      const exisUser = await userCollection.findOne(query);
      if(exisUser){
        return res.send({message:'already exists this user'})
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    })


// class collection
    app.get('/class', async(req,res) => {
        const result = await classCollection.find().toArray();
        res.send(result);
    })

    // selected api collection
    app.get('/selected', async(req, res) => {
      const email = req.query.email;
      if(!email){
        res.send([]);
      }
      const query = {email:email};
      const result = await selectedCollection.find(query).toArray();
      res.send(result);
    })

    app.post('/selected', async(req,res) => {
      const cla = req.body;
      console.log(cla);
      const result = await selectedCollection.insertOne(cla);
      res.send(result);

    })

    app.delete('/selected/:id', async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await selectedCollection.deleteOne(query);
      res.send(result);
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


app.get('/', (req,res) => {
    res.send('learn photography on running');
})

app.listen(port, () => {
    console.log(`learn photography running on port :${port}`);
})