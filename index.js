const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.port || 3001;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.to58y.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = client.db("EcoTrack");
const challengesCollection = db.collection("challenges");
const recentTipsCollection = db.collection("recentTips");

async function run() {
  try {
    // Get All Challenges
    app.get("/all_challenges", async (req, res) => {
      const result = await challengesCollection.find().toArray();
      res.send(result);
    });

    // Get three Challenges
    app.get("/challenges", async (req, res) => {
      const result = await challengesCollection.find().limit(3).toArray();
      res.send(result);
    });

    // Get Carousel Data
    app.get("/carousel_data", async (req, res) => {
      const result = await challengesCollection.find().limit(4).toArray();
      res.send(result);
    });

    // Get Active Challenges Data
    // ---------> Here featured need to change for show latest challenges
    app.get("/activate_challenges", async (req, res) => {
      const result = await challengesCollection.find().limit(4).toArray();
      res.send(result);
    });

    // Get Recent Tips
    app.get("/recent_tips", async (req, res) => {
      const result = await recentTipsCollection.find().toArray();
      res.send(result);
    });

    // Get Specific data using id
    app.get("/challenge/:id", async (req, res) => {
      // console.log(req.params.id);
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await challengesCollection.findOne(query);
      res.send(result);
    });

    // Create challenge
    app.post("/challenge", async (req, res) => {
      const data = req.body;
      const result = await challengesCollection.insertOne(data);
      res.send(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
