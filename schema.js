const fs = require("fs");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");

const haltestelles = JSON.parse(
  fs.readFileSync(`${__dirname}/client/src/data/data.json`, "utf-8")
);

// Location Type
const locationType = new GraphQLObjectType({
  name: "Location",
  fields: () => ({
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
  }),
});

// Haltestelle Type
const HaltestelleType = new GraphQLObjectType({
  name: "Haltestelle",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    adresse: { type: GraphQLString },
    location: { type: locationType },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    haltestelles: {
      type: new GraphQLList(HaltestelleType),
      resolve(parentValue) {
        return haltestelles;
        /*  
        When i will work with mongoDB
           promises (.then.catch)

        */
      },
    },
    haltestelle: {
      type: HaltestelleType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        for (let i = 0; i < haltestelles.length; i++) {
          if (haltestelles[i].id == args.id) {
            return haltestelles[i];
          }
        }
        /*  
        When i will work with mongoDB
             promises (.then.catch)

        */
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
