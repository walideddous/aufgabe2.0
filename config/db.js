const mongoose = require("mongoose");

const connectDB = async () => {
  if (process.env.MONGO_URI) {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } else {
    console.log("Mongo URI fehlt");
  }
};

module.exports = connectDB;
