// create the express server here
const express = require("express");
const { PORT = 3000} = process.env
const server = express();
const morgan = require("morgan");
require("dotenv").config();
server.use(morgan("dev"));
server.use(express.json());

server.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
  
    next();
  });

const { client } = require("./db");
client.connect();

server.listen(PORT, () => {
    console.log("The server is up on port", PORT);
  });