const express = require('express');
const { errorHandler } = require('./Middleware/errorHandler');
const connectDB = require('./Config/dbConn');
const cors = require('cors');
const app = express();
const userAccountRoutes = require('./Routes/userAccountRoutes');
const appRoutes = require('./Routes/appRoutes');

require('dotenv').config();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cors());


connectDB();
const port = process.env.PORT || 5000;
app.use(errorHandler);

app.get(["/","/ping"], async (req, res) => {
  res.json({ status: "Server Active" });
});

app.use("/api", userAccountRoutes);
app.use("/api", appRoutes);


app.listen(port, () => {
  console.log(`Social-Media-App-Api listening at http://localhost:${port}`);
});