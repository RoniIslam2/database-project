const express = require('express');
const cors = require('cors')

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = "mongodb+srv://user_database:98B7C970S43sSqGM@cluster0.ojhmezz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// const uri = "mongodb+srv://<db_username>:<db_password>@cluster0.ojhmezz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    const userCollection = client.db('userDB').collection('users')

        app.get('/users', async(req, res) => {
      const result = await userCollection.find().toArray()
      res.send(result)
    })

    app.post('/users', async(req, res)=> {
      const newUser = req.body;
      
      const result = await userCollection.insertOne(newUser)
      console.log(newUser)
      res.send(result)
    })


 app.get('/users/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result =  await userCollection.findOne(query);
      res.send(result)
    })
    
      app.delete('/users/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result =  await userCollection.deleteOne(query);
      res.send(result)
    })

    app.put('/users/:id', async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id)}
      const options = {upsert: true};
      const updatedUser = req.body;
      const updateDoc = {
        $set: updatedUser
      }
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
        res.send("User database server is run")
})

app.listen(port, () => {
        console.log(`user data is running on ${port}`)
})

// user_database
// 98B7C970S43sSqGM