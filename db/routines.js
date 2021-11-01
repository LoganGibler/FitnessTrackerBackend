const client = require("./client");

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

module.exports = {
    getActivityById,
  };