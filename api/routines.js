const express = require("express");
const routineRouter = express.Router();
const {
  getAllPublicRoutines,
  createRoutine,
  updateRoutine,
  destroyRoutine
} = require("../db/routines");
const {
  getRoutineActivitiesByRoutine,
  addActivityToRoutine,
} = require("../db/routine_activities");
const { requireUser } = require("./utils");

routineRouter.get("/", async (req, res, next) => {
  try {
    const routines = await getAllPublicRoutines();
    if (routines) {
      res.send(routines);
    } else {
      res.send({ message: "No activities found" });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

routineRouter.post("/", requireUser, async (req, res, next) => {
  const { name, goal, isPublic } = req.body;
  const id = req.user.id;

  try {
    
    if ((name, goal, isPublic)) {
      const createdRoutine = await createRoutine({
          creatorId: id,
          isPublic,
          name,
          goal });
      res.send(createdRoutine);
    } else {
      res.send({ message: "Missing fields" });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

routineRouter.patch("/:routineId", async (req, res, next) => {
  const { routineId } = req.params;
  const { name, goal, isPublic } = req.body;

  try {
    const updatedRoutine = await updateRoutine({
        id: routineId,
        name,
        goal,
        isPublic,
      });
      res.send(updatedRoutine);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

routineRouter.delete("/:routineId", requireUser, async (req, res, next) => {
    const id = req.params.routineId
    console.log(id, "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
    try {
        const deleteRoutine = await destroyRoutine(id);
        console.log(deleteRoutine, "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT")
        res.send(deleteRoutine)
    } catch (error) {
        next(error);
    }
})

routineRouter.post("/:routineId/activities", async (req, res, next) => {
  try {
    const { routineId } = req.params;
    const { activityId, count, duration } = req.body;
    const foundActivities = await getRoutineActivitiesByRoutine({
      id: routineId,
    });
    const filteredActivity =
      foundActivities &&
      foundActivities.filter((e) => e.activityId === activityId);

    if (filteredActivity && filteredActivity.length) {
      next({
        name: "Error",
        message: "Routine by this id already exists",
      });
    } else {
      const activity = await addActivityToRoutine({
        routineId,
        activityId,
        count,
        duration,
      });
      if (activity) {
        res.send(activity);
      } else {
        next({
          name: "Error",
          message: "Unable to add activity to routine",
        });
      }
    }
  } catch (error) {
    next(error);
  }
});

module.exports = routineRouter;