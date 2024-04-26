const express = require('express');
const cors = require('cors')
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());




// database connect
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@atlascluster.k7qynmg.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster`;

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

    const touristSpotCollections= client.db("touristSpotsDB").collection("touristSpots");



    app.post('/addTouristSpot', async(req, res) => {
        const touristSpot = req.body;
        // console.log(spot);
        const result = await touristSpotCollections.insertOne(touristSpot);
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


app.get('/', (req,res)=>{
    res.send("jr-travelo server is running !");
})

app.listen(port, ()=>{
    console.log(`server listing on port ${port}`);
})