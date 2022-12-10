const express = require("express");
const mongoose = require("mongoose");
const app = express();
const route = require("./routes/route");

app.use(express.json())

mongoose
  .connect("mongodb+srv://Shreyad:ULCn2m1OMNHF7ME0@cluster0.ufn2trt.mongodb.net/students_portal", { useNewUrlParser: true })
  .then(console.log("mongoDb is connected"))
  .catch((err) => {
    console.log("${err}");
  });

app.use("/", route);
 
app.listen(3000, ()=> {console.log("express running on port 3000")})