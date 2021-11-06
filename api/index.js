// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router
const express = require("express");
const apiRouter = express.Router();

apiRouter.use((req, res, next) => {
    if (req.user) {
      console.log("User is set:", req.user);
    }
  
    next();
  });

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const healthRouter = require("./health");
apiRouter.use("/health", healthRouter);

apiRouter.use((error, req, res, next) => {
    res.send(error);
  });

module.exports = apiRouter;