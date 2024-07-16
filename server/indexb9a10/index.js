const express = require("express");
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i2cqtwl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);


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
    // await client.connect();

    const craftCollection = client.db('craftDB').collection('craft')
    const userCollection = client.db('craftDB').collection('user');

    app.get('/craft', async (req, res)=>{
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/craft/:id', async (req, res)=>{
      const id = req.params.id;
      const quary = {_id: new ObjectId(id)};
      const result = await craftCollection.findOne(quary);
      res.send(result);
    })

    app.post('/craft', async (req, res) =>{
      const newCraft = req.body;
      console.log(newCraft);
      const result = await craftCollection.insertOne(newCraft);
      res.send(result);
    })
    
    app.put('/craft/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const option = { upsert: true};
      const updatedCraft = req.body;
      const craft = {
        $set:{
          itemname: updatedCraft.itemname,
          Subcategory_Name:updatedCraft.Subcategory_Name,
          short_description: updatedCraft.short_description,
          price:updatedCraft.price,
          customization: updatedCraft.customization,
          processing_time: updatedCraft.processing_time,
          stockStatus: updatedCraft.stockStatus,
          User_Email: updatedCraft.User_Email,
          User_Name: updatedCraft.User_Name,
          photo: updatedCraft.photo,
        }
     }
      const result = await craftCollection.updateOne(filter, craft, option);
      res.send(result);
    })
    app.delete('/craft/:id', async(req, res)=>{
      const id = req.params.id;
      const quary = {_id: new ObjectId(id)};
      const result = await craftCollection.deleteOne(quary);
      res.send(result);
    })
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
   finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// check if the server is running
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
