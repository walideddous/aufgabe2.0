const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const dotenv = require("dotenv");
const { verify } = require("jsonwebtoken");
const schema = require("./schema.js");

const app = express();

// Load env vars
dotenv.config({ path: "./config.env" });

// Database Name
const dbName = "ptdata";

// Body parser
app.use(express.json());

// enable `cors` to set HTTP response header: Access-Control-Allow-Origin: *
app.use(cors());

// Middelware for the jsonwebtoken
app.use((req, _, next) => {
  let accessToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    accessToken = req.headers.authorization.split(" ")[1];
    try {
      const data = verify(accessToken, process.env.JWT_SECRET);
      if (data) {
        next();
      }
    } catch {
      console.error("token Incorrect not authorized");
    }
  } else {
    console.log("No token Provided");
  }
});

// use GraphQl
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

// Route
app.get("/", (req, res) => res.send("API is Running"));

// Get all the data from the walid.stopSequence collection
app.get("/data", (req, res) => {
  if (process.env.MONGO_URI) {
    MongoClient.connect(process.env.MONGO_URI, function (err, client) {
      assert.strictEqual(null, err);
      console.log("Connected successfully to server");
      // Get the dataBase
      const db = client.db(dbName);
      // Get the documents collection
      const collection = db.collection("walid.stopSequence");
      // Find some documents
      collection.find().toArray(function (err, result) {
        assert.strictEqual(null, err);
        if (result.length) {
          res.json({
            msg: "fetch data succed",
            stopSequence: result,
          });
        } else {
          res.status(404).json({
            msg: "stopSequence document empty",
            stopSequence: {},
          });
        }
        console.log("Stopsequence fetched and dataBase closed");
        client.close();
      });
    });
  } else {
    console.log("Mongo URI fehlt");
  }
});

// Create the stop sequence in walid.stopSequence collection
app.put("/savedStopSequence", async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        msg: "req.body not found",
      });
    }
    if (process.env.MONGO_URI) {
      MongoClient.connect(process.env.MONGO_URI, function (err, client) {
        assert.strictEqual(null, err);
        console.log("Connected successfully to server");
        // Get the dataBase
        const db = client.db(dbName);

        // Get the collection
        const collection = db.collection("walid.stopSequence");
        // Insert the document
        collection.insertOne(req.body, function (err, result) {
          assert.strictEqual(err, null);
          res.json({
            msg: "saved",
            stopSequence: result.ops,
          });
          console.log("stopSequence saved and dataBase closed");
          client.close();
        });
      });
    } else {
      console.log("Mongo URI fehlt");
    }
  } catch (err) {
    console.log(err.stack);
  }
});

// Delete the stop sequence from walid.stopSequence collection
app.delete("/savedStopSequence/:id", async (req, res) => {
  try {
    if (process.env.MONGO_URI) {
      MongoClient.connect(process.env.MONGO_URI, function (err, client) {
        assert.strictEqual(null, err);
        console.log("Connected successfully to server");
        // Get the dataBase
        const db = client.db(dbName);

        const deleteDocument = async function (db, callback) {
          // Get the collection
          const collection = db.collection("walid.stopSequence");
          // Check if the Id exist
          const result = await collection
            .find({ _id: req.params.id })
            .toArray();
          if (!result.length) {
            return res.status(404).json({
              msg: `Document with id ${req.params.id} not found`,
            });
          }
          // Insert the document
          await collection.deleteOne({ _id: req.params.id }, function (
            err,
            result
          ) {
            assert.strictEqual(err, null);
            res.json({
              msg: `Document with id ${req.params.id} deleted`,
              stopSequence: {},
            });
            callback(result);
          });
        };

        deleteDocument(db, function () {
          client.close();
          console.log("Data deleted and database closed ");
        });
      });
    } else {
      console.log("Mongo URI fehlt");
    }
  } catch (err) {
    console.log(err.stack);
  }
});

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server && exit process
  server.close(() => process.exit(1));
});

module.exports = server;
