const mongoose = require("mongoose");

/* When you work with mongoose, you're working with promises. 
Mongoose returns promises, so instead of using .then, you should use async/await (preferred). */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Stops warnings in console
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1); // Stops process by exiting with failure -> (1)
  }
};

module.exports = connectDB;