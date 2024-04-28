const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//? middleware:
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://artisan-alley-cc33d.web.app"]
  }));
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

    //! POST
    app.post('/crafts', async(req, res) => {
      const newCrafts = req.body;
      const result = await craftCollection.insertOne(newCrafts);
      res.send(result);
    })

    //! GET
    app.get('/crafts', async(req, res) => {
      const cursor = craftCollection.find();
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