const client = require("./client");
const {attachActivitiesToRoutines} = require("./activities");

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
    //we get id, user.id = 1
    //use getAllroutines, loop through and use if statement on if user.id = user.id, add to an array, return array 
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
/////COME BACK TO THIS, MUST COMPLETE ROUTINE ACTIVITIES FUNCTIONS
async function getPublicRoutinesByActivity(activity){
    // console.log("this is activity they give us",activity)
    // expect(routine.isPublic).toBe(true);
    //activity = id, name, description
    const routines = await getAllRoutines()
    // console.log("this is the routine's activites",routines[0].activities)
    try {
        
    } catch (error) {
        throw error
    }
}

async function getPublicRoutinesByUser(user){
    // console.log("this is user",user)
    const filteredRoutines = []
    const routines = await getAllRoutines()
    // expect(routine.creatorId).toBe(user.id);
    // expect(routine.isPublic).toBe(true);
    try {
        routines.map((routine)=>{
            if(routine.creatorId === user.id && routine.isPublic === true){
                filteredRoutines.push(routine)
            }
        })
        // console.log("this is filteredRoutines",filteredRoutines)
        return filteredRoutines
        
    } catch (error) {
        throw error
    }
}


//SHOULDNT DO THE WORK
async function destroyRoutine(routineId){
    try {
        const { rows } = await client.query(`
            DELETE FROM routines
            WHERE id=$1
        `, [routineId]);
        console.log("this is deleted routine" , routine)
    } catch (error) {
        throw error
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


    if (!routine){
        throw {
            name: "routine not found",
            message: "could not find routine with that id."
        }
    }
    return routine
} catch (error) {
    throw error
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
    getPublicRoutinesByActivity
  };