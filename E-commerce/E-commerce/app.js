const express = require("express");
const app = express();
const cors=require('cors')
const productRoutes =require("./routes/productRoutes")
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
const DbConnection = async () => {
    try {
      await mongoose.connect('mongodb+srv://kmugeis2005:dontforgetit@mugeishhero.ggr3iod.mongodb.net/Ecommerce?retryWrites=true&w=majority&AppName=mugeishhero');
      console.log("DB Connection Success");
    } catch (error) {
      console.error("Oops! Server Error: " + error);
    }
  }
  DbConnection();
app.set("view engine","ejs");
app.use("/", productRoutes);

app.listen(6200, () => {
    console.log("Server is running on port 6200");
});

