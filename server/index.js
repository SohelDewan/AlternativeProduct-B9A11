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

// // verify jwt middleware
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
    const recommendationCollection = client.db('alternativeProducts').collection('recommendations');

      // // jwt generate
      app.post('/jwt', async (req, res) => {
        const email = req.body
        const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '60d',
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
    app.get('/products/:id',  async (req, res) => {
      const id = req.params.id;
      const quary = {_id: new ObjectId(id)};
      const result = await productCollection.findOne(quary);
      res.send(result);
      const options = {
          projection: { queryTitle: 1, userInfo: 1, productImage: 1, datePosted:1 },
      };
  })
  // Save a product/query data in db
  app.post('/product', async (req, res) => {
    const productData = req.body
    // console.log(queryData)
    // return
    const result = await productCollection.insertOne(productData)
    res.send(result)
  })

  // get all products/query posted by a specific user/ to find all products
  app.get('/product/:email',  async (req, res) => {
    // const tokenEmail = req.user.email
    const email = req.params.email
    // if (tokenEmail !== email) {
    //   return res.status(403).send({ message: 'forbidden access' })
    // }
    const query = { 'userInfo.email': email } 
    // buyer.email should be changed like queFinder.email
    const result = await productCollection.find(query).toArray()
    res.send(result)
  })

      // delete a product data from db
      app.delete('/products/:id', async (req, res) => {
        const id = req.params.id
        const query = { _id: new ObjectId(id) }
        const result = await productCollection.deleteOne(query)
        res.send(result)
      })
      // update a product in db
      app.put('/products/:id', async (req, res)=>{
        const id = req.params.id
        const productData = req.body
        const query = { _id: new ObjectId(id) }
        const options = {upsert: true } 
        // if any data is not found id db then it will create a new one for options
        const updateDoc = { 
          $set: {...productData }}
        const result = await productCollection.updateOne(query, updateDoc, options)
        res.send(result)
      })

   // Save a recommendation data in db
   app.post('/recommendations', async (req, res) => {
    const queryData = req.body
    // console.log(queryData)
    // return
    const result = await recommendationCollection.insertOne(queryData)
    res.send(result)
  })

   // Get all recommendations by email of a specific user from mongodb
   app.get('/recommendations/:email',   async (req, res) => {
    const email = req.params.email
    const query ={ email } 
    const result = await recommendationCollection.find(query).toArray();
    res.send(result);
  })

  // Get all recommendations for me by other user owner of the query/product from mongodb
  app.get('/recommendation-me/:email', async (req, res) => {
    const email = req.params.email
    const query = { 'userInfo.email' : email} 
    const result = await recommendationCollection.find(query).toArray();
    res.send(result);
  })
    // Update status of the recommendations
    app.patch('/recommendation/:id', async (req, res) => {
      const id = req.params.id
      const status = req.body
      const query = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: status ,
      }
      const result = await recommendationCollection.updateOne(query, updateDoc)
      res.send(result)
    })
   // Save a recommendation data in db
   app.post('/recommendation', async (req, res) => {
    const recommendationData = req.body    
    // check if its a duplicate request
    const query = {
      email: recommendationData.email,
      productId: recommendationData.productId,
    }
    const alreadyApplied = await recommendationCollection.findOne(query)
    console.log(alreadyApplied)
    if (alreadyApplied) {
      return res
        .status(400)
        .send('You have already placed a query on this product.')
    }
    const result = await recommendationCollection.insertOne(recommendationData)

    // update a recommendation count in products collection
    const updateDoc = {
      $inc: { recommendation_count: 1 },
    }
    const productQuery = { _id: new ObjectId(recommendationData.productId) }
    const updateRecommendationCount = await productCollection.updateOne(productQuery, updateDoc)
    console.log(updateRecommendationCount)
    res.send(result)
  })

   
   
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send({message:"Server is running properly"});
});

app.listen(port, () => {
  console.log(`Server is running on port  ${port}`);
});