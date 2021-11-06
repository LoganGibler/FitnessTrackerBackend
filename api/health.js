const express = require("express");
const healthRouter = express.Router();

healthRouter.use((req, res, next) => {
    console.log("Healthy");
  
    next();
  });

  module.exports = healthRouter;