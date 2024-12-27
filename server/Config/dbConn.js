const mongoose = require('mongoose'); 

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.DATABASE_SERVER, {
      useNewUrlParser: true, // Recommended options
      useUnifiedTopology: true,
    });
    console.log("DB Connected:", connect.connection.host, connect.connection.name);
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1); 
  }
};

module.exports = connectDb;
