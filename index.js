const express = require("express");

const app = express();

app.use(express.json())

app.get("/test",(req,res) => {

   res.json({
  

   })  


})


app.listen(() => {
  console.log("Server started running on port 3001");
}, 3001);
