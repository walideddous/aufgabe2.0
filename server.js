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
app.get("/data", (req, res) => {
  if (process.env.MONGO_URI) {
    MongoClient.connect(process.env.MONGO_URI, function (err, client) {
      assert.strictEqual(null, err);
      console.log("Connected successfully to server");
      // Get the dataBase
      const db = client.db(dbName);
      const findDocuments = function (db, callback) {
        // Get the documents collection
        const collection = db.collection("mdv.ojp.stops");
        // Find some documents
        collection.find({}).toArray(function (err, docs) {
          assert.strictEqual(err, null);
          console.log("Found the following records");
          res.json(docs);
          callback(docs);
        });
      };

      findDocuments(db, function () {
        client.close();
        console.log("database closed ");
      });
    });
  } else {
    console.log("Mongo URI fehlt");
  }
});
app.post("/savedStopSequence", (req, res) => {
  if (!req.body) {
    return console.error("Req body not found");
  }
  var stopSeqenceStringify = JSON.stringify(req.body);

  fs.writeFile(
    `${__dirname}/data/savedStopSequence.json`,
    stopSeqenceStringify,
    function (err, result) {
      if (err) console.log("error", err);
    }
  );

  res.json({
    msg: "saved",
    stopSeqenceStringify,
  });
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
