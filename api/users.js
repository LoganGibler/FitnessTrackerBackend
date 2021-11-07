const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const {
  createUser,
  getUser,
  getUserByUsername,
  getUserById
} = require("../db");
const { JWT_SECRET="neverTell" } = process.env
const {
  requireUser,

} = require("./utils")

  // usersRouter.get("/", async (req, res, next) => {
  //   const users = await getAllUsers();
  
  //   res.send({
  //     users,
  //   });
  // });

  usersRouter.post("/login", async (req, res, next) => {
    
    const { username, password } = req.body;

    console.log("Hello")
  
    // request must have both
    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password",
      });
    }
  
    try {
      const user = await getUser({username, password});
      console.log(user, "UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU")
      if(!user) {
        next({name: "IncorrectCredentialsError",
            message: "Username or password is incorrect"
        })
      } else {
        const token = jwt.sign(
          { id: user.id, username: user.username }, JWT_SECRET, 
          {
            expiresIn: "1h",
          }
        );
        console.log(token, "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
        res.send({user, token, message: "you are logged in!"});
      }
  
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

  usersRouter.post('/register', async (req, res, next) => {

    try {
      const { username, password } = req.body;

      const queriedUser = await getUserByUsername(username);

      if (queriedUser) {
        res.status(401)
        
        next({
          name: 'UserExistsError',
          message: 'A user by that username already exists'
        });
      } else if (password.length<8){
        res.status(401)

        next({
          name: 'PasswordLengthError',
          message: 'Password Too Short!'
        })
      } else {
        const user = await createUser({
          username,
          password
        })
        console.log(user, '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        if(!user){
          next({
            name: 'UserCreationError',
            message: 'There was a problem registering you. Please try again.'
          })
        } else {
          const token = jwt.sign({ 
            id: user.id, 
            username: user.username
          }, JWT_SECRET, {
            expiresIn: '1w'
          });

          res.send({ 
            user,
            message: "you're signed up!",
            token 
          });
        }
      }
    } catch (error) {
      next (error)
    } 
  });

  usersRouter.get("/me", async (req, res, next) => {
    
    try {
  
      const user = await getUserById();
  
      if(!token){
        return null
      } else {
        res.send(user);
      }

    } catch (error) {
      next(error);
    }
  })

  module.exports = usersRouter;