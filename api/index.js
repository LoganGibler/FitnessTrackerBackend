// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router
const express = require("express");
const apiRouter = express.Router();
const client = require("../db/client");
const jwt = require("jsonwebtoken");
const { JWT_SECRET = "neverTell" } = process.env;
const { getUserById } = require("../db/users");

apiRouter.get("/health", async (req, res, next) => {
  try {
    res.send({
      message: "Healthy",
    });
  } catch (error) {
    next(error);
  }
});

apiRouter.use(async (req, res, next) => {
  const auth = req.header("Authorization");

  if (!auth) {
    return next();
  }

  if (auth.startsWith("Bearer ")) {
    const token = auth.slice("Bearer ".length);

    try {
      const parsedToken = jwt.verify(token, JWT_SECRET);
      console.log(parsedToken, "parsed token");

      const id = parsedToken && parsedToken.id;
      if (id) {
        req.user = await getUserById(id);
        next();
      }
      // const parsedToken = jwt.verify(token, JWT_SECRET);
      // console.log(parsedToken,'parsed token')

      //   const username = parsedToken && parsedToken.username
      //   console.log(username, 'userName')

      //   console.log(await getUserByUsername(username), 'user maybe')
      // if (username) {
      //   req.user = await getUserByUsername(username);
      //   return next();
      // }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({ name: "AuthError", message: "Error in authorization format" });
  }
});

apiRouter.use((req, res, next) => {
  console.log(req.user, "!!!!");
  if (req.user) {
    console.log("User is set:", req.user);
  }
  next();
});

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const activityRouter = require("./activities");
apiRouter.use("/activities", activityRouter);

const routineRouter = require("./routines");
apiRouter.use("/routines", routineRouter);

// apiRouter.use((error, req, res, next) => {
//   res.send(error);
// });
module.exports = apiRouter;