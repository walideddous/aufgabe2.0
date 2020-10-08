const MongoClient = require("mongodb").MongoClient;
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLID,
  GraphQLSchema,
  GraphQLList,
} = require("graphql");
const assert = require("assert");

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

// Time type
const timeType = new GraphQLObjectType({
  name: "Time",
  fields: () => ({
    Start: { type: GraphQLString },
    End: { type: GraphQLString },
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

// StopSequence Type
const StopSequenceType = new GraphQLObjectType({
  name: "StopSequence",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    valid: { type: GraphQLList(GraphQLString) },
    time: { type: timeType },
    stopSequence: { type: HaltestelleType },
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
    haltestelleByMode: {
      type: new GraphQLList(HaltestelleType),
      args: { modes: { type: GraphQLString } },
      resolve(parentValue, args) {
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

              result = await collection.find({ modes: args.modes }).toArray();
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
    stopSequence: {
      type: StopSequenceType,
      resolve(parentValue) {
        if (process.env.MONGO_URI) {
          MongoClient.connect(process.env.MONGO_URI, async function (
            err,
            client
          ) {
            assert.strictEqual(null, err);
            console.log("Connected successfully to server");
            // Get the dataBase
            const db = client.db(dbName);
            // Get the documents collection
            const collection = db.collection("walid.stopSequence");
            // Find some documents
            const result = await collection.find().toArray();

            console.log("Stopsequence fetched and dataBase closed");
            client.close();

            return result;
          });
        } else {
          console.log("Mongo URI fehlt");
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
