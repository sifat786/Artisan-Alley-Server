const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//? middleware:
app.use(cors());
app.use(express.json());

//? mongodb:

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zzvfjhd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();
    const craftCollection = client.db("craftDB").collection("CRAFTS");
    const categoryCollection = client.db("craftDB").collection('CATEGORIES');

    //* craft related api
    //! GET
    app.get('/crafts', async(req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/crafts/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.findOne(query);
      res.send(result);
    })

    app.get('/craftsByEmail/:email', async(req, res) => {
      const cursor = craftCollection.find({email: req.params.email})
      const result = await cursor.toArray();
      res.send(result);
    })

    //! POST
    app.post('/crafts', async(req, res) => {
      const newCrafts = req.body;
      const result = await craftCollection.insertOne(newCrafts);
      res.send(result);
    })

    //! PUT
    app.put('/crafts/:id', async(req, res) => {
      const id = req.params.id;
      const crafts = req.body;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true};
      const updatedCrafts = {
        $set: {
            name: crafts.name,
            price: crafts.price,
            rating: crafts.rating,
            time: crafts.time,
            photo: crafts.photo,
            category: crafts.category,
            customization: crafts.customization,
            stock: crafts.stock,
            description: crafts.description,
        }
      }
      const result = await craftCollection.updateOne(filter, updatedCrafts, options);
      res.send(result);
    })

    //! Delete
    app.delete('/crafts/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    })


    //* categories related api:
    app.get('/arts', async(req, res) => {
      const cursor = categoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/artsById/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await categoryCollection.findOne(query);
      res.send(result);
    })

    app.get('/arts/:category', async(req, res) => {
      const category = req.params.category;
      const cursor = categoryCollection.find({category: category});
      const result = await cursor.toArray();
      res.send(result);
    })

    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is running');
})

app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
})