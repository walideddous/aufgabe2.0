const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const fs = require("fs");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLID,
  GraphQLSchema,
  GraphQLList,
} = require("graphql");

// Database Name
const dbName = "ptdata";

// lat, lon Type
const latLonType = new GraphQLObjectType({
  name: "LatLon",
  fields: () => ({
    lat: { type: GraphQLFloat },
    lon: { type: GraphQLFloat },
  }),
});

// Location Type
const locationType = new GraphQLObjectType({
  name: "Location",
  fields: () => ({
    WGS84: { type: latLonType },
  }),
});

// Haltestelle Type
const HaltestelleType = new GraphQLObjectType({
  name: "Haltestelle",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    modes: { type: GraphQLList(GraphQLString) },
    coord: { type: locationType },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    haltestelles: {
      type: new GraphQLList(HaltestelleType),
      resolve(parentValue) {
        return (async function () {
          let client;
          let result;
          try {
            if (process.env.MONGO_URI) {
              client = await MongoClient.connect(process.env.MONGO_URI);
              console.log("Connected successfully to server");

              // Get the dataBase
              const db = client.db(dbName);

              // Get the documents collection
              const collection = db.collection("mdv.ojp.stops");

              result = await collection.find().toArray();
            } else {
              console.log("Mongo URI fehlt");
            }
          } catch (err) {
            console.log(err.stack);
          }
          // Close connection
          client.close();
          console.log("data fetched and database closed ");
          return result;
        })();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
