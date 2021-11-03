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
//COME BACK
// async function getAllRoutines(){

//     try {
//         const {rows: routines} = await client.query(`
//             SELECT routines.*, users.username AS "creatorName"
//             FROM routines
//             JOIN users ON routines."creatorId"=users.id;
//         `);
        
//         console.log("this is all routines", routines)
//         return attachActivitiesToRoutines(routines)
//     } catch (error) {
//         throw error
//     }
// }

async function getAllRoutines(){

    try {
        const { rows: routines} = await client.query(`
            SELECT *
            FROM routines;
        `);
        
        console.log("this is all routines", routines)
        return attachActivitiesToRoutines(routines)
    } catch (error) {
        throw error
    }
}

// async function destroyRoutine(routineId){
//     try {
//         const {rows : routine} = await client.query(`
//             DELETE * 
//             WHERE id=$1;

//         `);
//     } catch (error) {
//         throw error
//     }
// }

async function createRoutine({creatorId, isPublic, name, goal}){

    try {
        const {rows: [routine]} = await client.query(`
            INSERT INTO routines(creatorId, isPublic, name, goal)
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
    getRoutineById
  };