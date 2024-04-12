const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const database = require("./config/database");
const routes = require("./routes/route");
const auth = require("./routes/auth");
const user = require("./routes/user");

database.connect();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/v1/map" , routes);
app.use("/api/v1/auth" , auth);
app.use("/api/v1/user" , user);

app.get("/" , (req,res) => {
    res.send(`<h1>SERVER STARTED SUCESSFULLY</h1>`);
})

app.listen(4000 , () => {
    console.log("SERVER STARTED AT PORT 4000");
})
