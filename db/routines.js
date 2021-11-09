const { client }= require("./client");
const {attachActivitiesToRoutines} = require("./activities");
const {destroyRoutineActivity} = require("./routine_activities");
const {getUserByUsername} = require("./users");

async function getActivityById(activityId){
    try {

        const { rows: [activity]} = await client.query(`
            SELECT *
            FROM activities
            WHERE id=$1
        `, [activityId])

        if(!activity){
            return null
        }

        return activity
    } catch (error) {
        console.log(error)
    }
}

async function getAllRoutines(){

    try {
        const { rows: routines} = await client.query(`
            SELECT routines.*, users.username AS "creatorName"
            FROM routines
            JOIN users ON routines."creatorId"=users.id
        `);
        
        // console.log("this is all routines", routines)
        return attachActivitiesToRoutines(routines)
    } catch (error) {
        throw error
    }
}

async function getAllRoutinesByUser(user){
    // console.log("this is user",user)
    const routines = await getAllRoutines()
    const filteredRoutine = []
    // console.log("this is routines", routines)
    try {
        
        const filteredRoutines1 = routines.map((routine)=>{
            if(routine.creatorId === user.id){
                filteredRoutine.push(routine)
            }
            if(routine.creatorName === user.username){
                filteredRoutine.push(routine)
            }
        })
       
        // console.log("this is filteredRoutine",filteredRoutine)
        return filteredRoutine
    } catch (error) {
        throw error
    }
}

async function getAllPublicRoutines(){
    const filteredRoutines = []
    const routines = await getAllRoutines()
// console.log("this is routines!!!!!!",routines)
    try {
        
      const filteredRoutine =  routines.map((routine)=>{
        if(routine.isPublic === true){
            filteredRoutines.push(routine)
        }
        })
    // console.log("this is filteredRoutines",filteredRoutines)
    return filteredRoutines
       
    } catch (error) {
        throw error
    }
}

async function getPublicRoutinesByActivity({ id }) {
    try {
      const { rows: routines } = await client.query(`
      SELECT 
      routines.id,
      routines."creatorId",
      routines."isPublic",
      routines.name,
      routines.goal,
      users.username AS "creatorName"
      From routines
      JOIN users ON users.id = routines."creatorId"
      WHERE "isPublic" = true;
  `)
  
  
  return attachActivitiesToRoutines(routines)

    } catch (error) {
      throw error;
    }
  }

  async function getPublicRoutinesByUser({ username }) {
    try {
      const user = await getUserByUsername(username);
      const { rows: routines } = await client.query(
        `
        SELECT routines.*, users.username AS "creatorName" FROM routines 
        JOIN users ON routines."creatorId"=users.id
        WHERE "creatorId"=$1
        AND "isPublic"='true'
      `,
        [user.id]
      );
      return attachActivitiesToRoutines(routines);
    } catch (error) {
      throw error;
    }
  }



  async function destroyRoutine(id) {
    try {
      await destroyRoutineActivity(id);
  
      const {
        rows: [routine],
      } = await client.query(
        `
      DELETE FROM routines 
      where id = $1
      RETURNING *;
      `,
        [id]
      );
      return routine;
    } catch (error) {
      throw error;
    }
  }

async function createRoutine({creatorId, isPublic, name, goal}){

    try {
        const {rows: [routine]} = await client.query(`
            INSERT INTO routines("creatorId", "isPublic", "name", "goal")
            VALUES($1, $2, $3, $4)
            RETURNING *;
        `, [creatorId, isPublic, name, goal]);
        // console.log("this is routine",routine)
         return routine
    } catch (error) {
        throw error
    }
}

async function getRoutineById(routineId){
try {
    const {rows : [routine]} = await client.query(`
        SELECT * FROM
        routines
        where id=$1
    `, [routineId])


    // if (!routine){
    //     throw {
    //         name: "routine not found",
    //         message: "could not find routine with that id."
    //     }
    // }
    return routine
} catch (error) {
    throw error
}

}

async function updateRoutine({ id, isPublic, name, goal }) {
    try {
      const {
        rows: [routines],
    } = await client.query(
        `
    UPDATE routines
    SET 
    "isPublic" = $2,
    "name" = $3,
    "goal" = $4
    WHERE "id"= $1
    RETURNING *;
  `,[id, isPublic, name, goal]
    );

    return routines;
      
    } catch (error) {
      throw error;
    }
  }

  async function getRoutinesWithoutActivities() {
    try {
      const { rows: routines } = await client.query(`
      SELECT * 
      FROM routines
  `);
  
  return routines;
    } catch (error) {
      throw error;
    }
  }
  
module.exports = {
    getActivityById,
    getAllRoutines,
    createRoutine,
    getRoutineById,
    destroyRoutine,
    getAllPublicRoutines,
    getAllRoutinesByUser,
    getPublicRoutinesByUser,
    getPublicRoutinesByActivity,
    updateRoutine,
    getRoutinesWithoutActivities
  };