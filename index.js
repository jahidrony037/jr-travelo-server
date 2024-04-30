const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId, Int32 } = require('mongodb');
const cors = require('cors')
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;


// {origin:["http://localhost:5173","https://jr-travelo-server.vercel.app"]}
// middleware 
app.use (cors({origin:["http://localhost:5173","https://jr-travelo.web.app","https://jr-travelo-server.vercel.app"]}));
app.use(express.json());




// database connect
// const uri = "mongodb://localhost:27017";

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
    const subCategoryCollections= client.db("touristSpotsDB").collection("subCatagories");


    //create new tourist spot api 
    app.post('/addTouristSpot', async(req, res) => {
        const cursor = req.body;
        // console.log(touristSpot);
        const touristSpot= {
              email:cursor.email,
              userName:cursor.userName,
              photoUrl:cursor.photoUrl,
              seasonality:cursor.seasonality,
              touristSpotName:cursor.touristSpotName,
              countryName:cursor.countryName,
              location:cursor.location,
              description:cursor.description,
              averageCost:new Int32(cursor.averageCost),
              travelTime:cursor.travelTime,
              totalVisitorsPerYear:cursor.totalVisitorsPerYear,
        }
        const result = await touristSpotCollections.insertOne(touristSpot);
        res.send(result);

    })

    //get all tourist spots added by user (for user List)
    app.get('/touristSpots/:email', async(req, res)=>{
        const email = req.params.email;
        // console.log("line 65",typeof email);
        const query = {email: email};
        const result = await touristSpotCollections.find(query).toArray();
        res.send(result);

    })

    //delete tourist spot by user api
    app.delete('/touristSpots/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await touristSpotCollections.deleteOne(query);
        res.send(result);
    })

    //get a single tourist spot api
    app.get('/allTouristSpots/:id', async(req, res)=>{
      const id = req.params.id;
      // console.log("line 82", typeof id);
      const query = {_id: new ObjectId(id)};
      const result = await touristSpotCollections.findOne(query);
      res.send(result);
    })
    //update a single tourist spot by user api
    app.put('/allTouristSpots/:id', async(req,res)=>{
      const id=req.params.id;
      // console.log(id);
      const touristSpot = req.body;
      // console.log("line 77",touristSpot);
      const query={_id:new ObjectId(id)};
      const options = { upsert: true };
      const updateTouristSpot = {
        $set:{
              photoUrl:touristSpot.photoUrl,
              seasonality:touristSpot.seasonality,
              touristSpotName:touristSpot.touristSpotName,
              countryName:touristSpot.countryName,
              location:touristSpot.location,
              description:touristSpot.description,
              averageCost:new Int32(touristSpot.averageCost),
              travelTime:touristSpot.travelTime,
              totalVisitorsPerYear:touristSpot.totalVisitorsPerYear, 
        }
      }

      const result = await touristSpotCollections.updateOne(query,updateTouristSpot,options);
      res.send(result);
    })


    //all tourist spot get api 
    app.get('/allTouristSpots', async(req,res)=>{
      const result = await touristSpotCollections.find().toArray();
      res.send(result); 
    })

    //all subCategory get api
    app.get('/subCategories', async(req,res)=>{
      const result = await subCategoryCollections.find().toArray();
      res.send(result);
    })
    

    //specific subCategory load api
    app.get('/subCategories/:countryName', async(req,res)=>{
      const countryName = req.params.countryName;
      // console.log(countryName, typeof countryName);
      const query = {countryName: countryName};
      const result = await touristSpotCollections.find(query).toArray();
      res.send(result);
    })

    app.get('/subCategories/:countryName/:id', async(req, res)=>{
      const id= req.params.id;
      // console.log("line 138", typeof id, id);
      const query={_id:new ObjectId(id)};
      const result = await touristSpotCollections.findOne(query);
      res.send(result);
    })

    // for sorting api
    app.get('/allTouristSpot/sort', async(req,res)=>{
        const sortedData = await touristSpotCollections.find().sort({averageCost:1}).toArray();
        res.send(sortedData);
    })





    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
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