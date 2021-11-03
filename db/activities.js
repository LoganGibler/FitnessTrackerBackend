const { promise } = require("bcrypt/promises");
const client = require("./client");
const {dbFields} = require("./ultilities")

async function attachActivitiesToRoutines(routines) {
  // no side effects
  const routinesToReturn = [...routines];
  const binds = routines.map((_, index) => `$${index + 1}`).join(", ");
  const routineIds = routines.map((routine) => routine.id);
  if (!routineIds?.length) return;
  try {
    // get the activities, JOIN with routine_activities (so we can get a routineId), and only those that have those routine ids on the routine_activities join
    const { rows: activities } = await client.query(
      `
        SELECT activities.*, routine_activities.duration, routine_activities.count, routine_activities.id AS "routineActivityId", routine_activities."routineId"
        FROM activities
        JOIN routine_activities ON routine_activities."activityId" = activities.id
        WHERE routine_activities."routineId" IN (${binds});
      `,
      routineIds
    );
    // loop over the routines
    for (const routine of routinesToReturn) {
      // filter the activities to only include those that have this routineId
      const activitiesToAdd = activities.filter(
        (activity) => activity.routineId === routine.id
      );
      // attach the activities to each single routine
      routine.activities = activitiesToAdd;
    }
    return routinesToReturn;
  } catch (error) {
    throw error;
  }
}

async function createActivity({ name, description }) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
              INSERT INTO activities(name, description)
              VALUES($1, $2)
              RETURNING *;
          `,
      [name, description]
    );
    return activity;
  } catch (error) {
    throw error
  }
}

async function getAllActivities() {
  try {
    const {
      rows
    } = await client.query(`
          SELECT *
          FROM activities;
      `);

    // const activities = await activity.map((element) => {
    //   return element;
    // });

    return rows
  } catch (error) {
    throw error
  }
}
//DOES NOT WORK////////////////////////////////////////////////////////////////////////////////////
// async function updateActivity({id, ...fields}) {

//   try {
//     const fieldsToUpdate = {}
//     for(let col in fields){
//       console.log("column", col)
//       if (fields[col] !== undefined){
//         fieldsToUpdate[col] = fields[col]
//       }
      
//     }

//     if(dbFields(fieldsToUpdate).insert.length > 0){
//       const {
//         rows
//       } = await client.query(`
//       UPDATE activities
//       SET ${dbFields(fieldsToUpdate).insert}
//       WHERE id=${id}
//       RETURNING *;
//     `, Object.values(fieldsToUpdate));
  
//     }
    
//   return rows[0]
//   } catch (error) {
//     console.log(error);
//   }
// }



module.exports = {
  createActivity,
  getAllActivities,
  // updateActivity,
  attachActivitiesToRoutines
};
