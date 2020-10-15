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
    start: { type: GraphQLString },
    end: { type: GraphQLString },
  }),
});

// Schedule type
const scheduleType = new GraphQLObjectType({
  name: "Schedule",
  fields: () => ({
    day: { type: GraphQLList(GraphQLString) },
    time: { type: GraphQLList(timeType) },
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
    date: { type: GraphQLList(GraphQLString) },
    schedule: { type: GraphQLList(scheduleType)  },
    stopSequence: { type: GraphQLList(HaltestelleType) },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // Query all the stops
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
    // Query stops by Modes
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
    // Query stop sequence by Modes
    stopSequence: {
      type: new GraphQLList(StopSequenceType),
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
              const collection = db.collection("walid.stopSequence");

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
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
