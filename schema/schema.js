const MongoClient = require("mongodb").MongoClient;
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

// Time type
const dayTime = new GraphQLObjectType({
  name: "Time",
  fields: () => ({
    day: { type: GraphQLList(GraphQLString) },
    time: { type: GraphQLList(GraphQLString) },
  }),
});

// Schedule type
const scheduleType = new GraphQLObjectType({
  name: "Schedule",
  fields: () => ({
    date: { type: GraphQLString },
    dayTime: { type: GraphQLList(dayTime) }
  }),
});

// Haltestelle Type
const HaltestelleType = new GraphQLObjectType({
  name: "Haltestellen",
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
    modes: { type: GraphQLString },
    schedule: { type: GraphQLList(scheduleType) },
    stopSequence: { type: GraphQLList(HaltestelleType) },
  }),
});

const HaltestelleByDistanceType = new GraphQLObjectType({
  name: "HaltestellenByDistance",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    modes: { type: GraphQLList(GraphQLString) },
    coord: { type: locationType },
    calcDistance: { type: GraphQLFloat }
  }),
});


// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // Query all the stops
    haltestellen: {
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
    // Get stop with the max distance of arg.distance
    stopsByDistance: {
      type: new GraphQLList(HaltestelleType),
      args: { distance: { type: GraphQLFloat } },
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

              result = await collection.find({ _geo2d: { $near: { $maxDistance: args.distance, $geometry: { type: "Point", coordinates: [6.08824, 46.17831] } } } }).toArray();
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
    // Get sorted stops 
    stopsSortedByDistance: {
      type: new GraphQLList(HaltestelleByDistanceType),
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

              result = await collection.aggregate([{ $geoNear: { near: { type: "Point", coordinates: [6.08824, 46.17831] }, spherical: true, distanceField: "calcDistance" } }, { $match: { modes: args.modes } }]).toArray();
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
    // Get all stop sequence
    stopSequence: {
      type: new GraphQLList(StopSequenceType),
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
              const collection = db.collection("walid.stopSequence");

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
    // Query stop sequence by Modes
    stopSequenceByMode: {
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
