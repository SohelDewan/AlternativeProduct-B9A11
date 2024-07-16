const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 9000;
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://assignment-category-0009.web.app'
  ],
  credentials: true,
  optionSuccessStatus: 200,
}

// middleware 

app.use(cors(corsOptions))
app.use(express.json())
// app.use(cookieParser())
// check if the server is running

const uri = `mongodb+srv://alternativeProducts:OKMI2REQrXtrot6o@cluster0.i2cqtwl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

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

    const productCollection = client.db('alternativeProducts').collection('products');

    app.get('/products', async (req, res) => {
      const products = await productCollection.find().toArray();
      res.send(products);
    })
    
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const quary = {_id: new ObjectId(id)};
      const result = await productCollection.findOne(quary);
      res.send(result);
      // const options = {
      //     projection: { queryTitle: 1, userInfo: 1, productImage: 1, datePosted:1 },
      // };
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

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});