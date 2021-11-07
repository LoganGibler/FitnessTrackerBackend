// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router
const express = require("express");
const apiRouter = express.Router();
const client = require("../db/client")
const jwt = require("jsonwebtoken");
const { JWT_SECRET="neverTell" } = process.env

// apiRouter.use((req, res, next) => {
//     if (req.user) {
//       console.log("User is set:", req.user);
//     }
  
//     next();
//   });

apiRouter.get("/health", async (req, res, next) => {
    try {
      res.send({
        message: "Healthy"
      })
    } catch (error) {
      next(error)
    }
});

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

apiRouter.use((error, req, res, next) => {
    res.send(error);
  });

module.exports = apiRouter;