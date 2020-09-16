const fs = require("fs");
const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const dotenv = require("dotenv");
const { verify } = require("jsonwebtoken");
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
dotenv.config({ path: "./config.env" });

//Connect to Database
connectDB();

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
