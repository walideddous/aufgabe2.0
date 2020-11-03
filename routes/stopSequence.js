const express = require("express")
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const router = express.Router()

// Database Name
const dbName = "ptdata";

// @route GET /data
// @desc Get all stop sequence
// @ express Private

router.get("/data", (req, res) => {
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

// @route PUT /savedStopSequence
// @desc Create a new stopSequence
// @ express Private

router.put("/savedStopSequence", async (req, res) => {
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

// @route DELETE /savedStopSequence/:id
// @desc Delete stopSequence by ID
// @ express Private

  router.delete("/savedStopSequence/:id", async (req, res) => {
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
            // Delete the document
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
            console.log("Stop sequence deleted and database closed ");
          });
        });
      } else {
        console.log("Mongo URI fehlt");
      }
    } catch (err) {
      console.log(err.stack);
    }
  });


  module.exports = router