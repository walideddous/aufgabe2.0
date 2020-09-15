const fs = require("fs");
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const dotenv = require("dotenv");
const schema = require("./schema.js");

// Import the data to test
const result = fs.readFileSync(
  `${__dirname}/client/src/data/data.json`,
  "utf-8"
);

// Import the database
const connectDB = require("./config/db");

const app = express();

// Load env vars
dotenv.config({ path: "./config/config.env" });

//Connect to Database
connectDB();

// Body parser
app.use(express.json());

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
app.get("/data", (req, res) => res.send(result));

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
