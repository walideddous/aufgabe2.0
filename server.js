const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const dotenv = require("dotenv");
const { verify } = require("jsonwebtoken");
const schema = require("./schema/schema.js");

const app = express();

// Load env vars
dotenv.config({ path: "./config.env" });

// Body parser
app.use(express.json());

// enable `cors` to set HTTP response header: Access-Control-Allow-Origin: *
app.use(cors());

// Route
app.get("/", (req, res) => res.send("API is Running"));

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
app.use("", require("./routes/stopSequence"))


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
