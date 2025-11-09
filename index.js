const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.port || 3001;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.to58y.mongodb.net/?appName=Cluster0`;

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
const usersCollection = db.collection("users");
const upcomingEventsLeft = db.collection("upcomingLeft");
const statsCollection = db.collection("stats");

async function run() {
  try {
    //  Get All Challenges
    app.get("/all_challenges", async (req, res) => {
      const { category, sort } = req.query;
      // console.log(category);
      // console.log(sort);

      let query = {};
      if (category && category !== "All") {
        query = { category: category.trim() };
      }

      let cursor = challengesCollection.find(query);

      if (sort) {
        const sortOpt = sort === "asc" ? 1 : -1;
        cursor = cursor.sort({ participants: sortOpt });
      }

      const result = await cursor.toArray();
      res.send(result);
    });

    //  Get three Challenges
    app.get("/challenges", async (req, res) => {
      const result = await challengesCollection.find().limit(3).toArray();
      res.send(result);
    });

    //  Carousel Data
    app.get("/carousel_data", async (req, res) => {
      const result = await challengesCollection.find().limit(4).toArray();
      res.send(result);
    });

    //  Active Challenges
    app.get("/activate_challenges", async (req, res) => {
      const result = await challengesCollection.find().limit(4).toArray();
      res.send(result);
    });

    //  Recent Tips
    app.get("/recent_tips", async (req, res) => {
      const result = await recentTipsCollection.find().toArray();
      res.send(result);
    });

    //  Get Single Challenge by ID
    app.get("/challenge/:id", async (req, res) => {
      const id = req.params.id;
      const result = await challengesCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    //  Create Challenge
    app.post("/challenge", async (req, res) => {
      const data = req.body;
      const result = await challengesCollection.insertOne(data);
      res.send(result);
    });

    //  Join Challenge increment the value for the count also add user data in db!
    app.patch("/challenge/:id", async (req, res) => {
      try {
        const challengeId = req.params.id;
        const { email } = req.body;

        // ncrement logic
        const result = await challengesCollection.updateOne(
          { _id: new ObjectId(challengeId) },
          { $inc: { participants: 1 } }
        );

        // add challenge to the database
        await usersCollection.updateOne(
          { email },
          {
            $push: {
              joinedChallenges: {
                challengeId,
                status: "Not Started",
                progress: 0,
                joinDate: new Date(),
              },
            },
          },
          { upsert: true }
        );

        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to join challenge" });
      }
    });

    //  Status update logic
    app.patch("/user/:email/update-status", async (req, res) => {
      const email = req.params.email;
      const { challengeId, newStatus } = req.body;

      try {
        const result = await usersCollection.updateOne(
          { email, "joinedChallenges.challengeId": challengeId },
          { $set: { "joinedChallenges.$.status": newStatus } }
        );

        if (result.modifiedCount === 0) {
          return res
            .status(404)
            .send({ message: "Challenge not found for user" });
        }

        res.send({ message: "Status updated successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update status" });
      }
    });

    // Get User sathe Challenge Details
    app.get("/my_activity", async (req, res) => {
      const email = req.query.email;

      if (!email) {
        return res.status(400).send({ message: "Email is required" });
      }

      try {
        // find  user and get and also his/her joined challenge show
        const user = await usersCollection.findOne({ email });

        if (
          !user ||
          !user.joinedChallenges ||
          user.joinedChallenges.length === 0
        ) {
          return res
            .status(404)
            .send({ message: "No joined challenges found" });
        }

        // Get all challenges id
        const challengeIds = user.joinedChallenges.map((c) => c.challengeId);

        // challenged fetched logic
        const challenges = await challengesCollection
          .find({
            _id: { $in: challengeIds.map((id) => new ObjectId(id)) },
          })
          .toArray();

        // Combine the status or you can change the status on db
        const combinedData = challenges.map((ch) => {
          const userData = user.joinedChallenges.find(
            (u) => u.challengeId === ch._id.toString()
          );
          return {
            ...ch,
            status: userData?.status || "Not Started",
            progress: userData?.progress || 0,
            joinDate: userData?.joinDate || null,
          };
        });

        res.send(combinedData);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to fetch user activity" });
      }
    });

    // ---------> Upcoming events section --------->
    app.get("/upcomingLeft", async (req, res) => {
      const result = await upcomingEventsLeft.find().toArray();
      res.send(result);
    });

    // ---------> Stats collection <---------------
    app.get("/stats", async (req, res) => {
      const result = await statsCollection.find().toArray();
      res.send(result);
    });

    // ------------->  Delete challenge <-------------
    app.delete("/challenge/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const result = challengesCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    await client.connect();
    // await client.db("admin").command({ ping: 1 });
    // console.log(" Connected to MongoDB successfully!");
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("EcoTrack Server is running");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
