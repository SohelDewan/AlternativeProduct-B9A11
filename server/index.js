const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
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
app.use(cookieParser())
// check if the server is running

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.i2cqtwl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
// verify jwt middleware
const verifyToken = (req, res, next) => {
  const token = req.cookies?.token
  if (!token) return res.status(401).send({ message: 'unauthorized access' })
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.log(err)
        return res.status(401).send({ message: 'unauthorized access' })
      }
      console.log(decoded)

      req.user = decoded
      next()
    })
  }
}

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productCollection = client.db('alternativeProducts').collection('products');

      // jwt generate
      app.post('/jwt', async (req, res) => {
        const email = req.body
        const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '36d',
        })
        res
          .cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          })
          .send({ success: true })
      })
  
      // Clear token on logout
      app.get('/logout', (req, res) => {
        res
          .clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 0,
          })
          .send({ success: true })
      })
      
      // Get all products
    app.get('/products', async (req, res) => {
      const products = await productCollection.find().toArray();
      res.send(products);
    })
    
    // Get a single product by id
    
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const quary = {_id: new ObjectId(id)};
      const result = await productCollection.findOne(quary);
      res.send(result);
      // const options = {
      //     projection: { queryTitle: 1, userInfo: 1, productImage: 1, datePosted:1 },
      // };
  })
   // Save a product data in db
   app.post('/product', async (req, res) => {
    const jobData = req.body
    const result = await jobsCollection.insertOne(jobData)
    res.send(result)
  })

  // get all products posted by a specific user
  app.get('/products/:email', verifyToken, async (req, res) => {
    const tokenEmail = req.user.email
    const email = req.params.email
    if (tokenEmail !== email) {
      return res.status(403).send({ message: 'forbidden access' })
    }
    const query = { 'buyer.email': email }
    const result = await jobsCollection.find(query).toArray()
    res.send(result)
  })
    // Save a query data in db
    app.post('/product', async (req, res) => {
      const queryData = req.body

      const result = await productCollection.insertOne(queryData)
      res.send(result)
    })
      // delete a product data from db
      app.delete('/product/:id', async (req, res) => {
        const id = req.params.id
        const query = { _id: new ObjectId(id) }
        const result = await productCollection.deleteOne(query)
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

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});