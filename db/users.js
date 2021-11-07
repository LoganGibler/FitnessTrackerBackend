const client = require("./client");

//NOT WORKING
async function getUser({ username, password }) {
  if (!username || !password) {
    return;
  }

  try {
    const user = await getUserByUsername(username);
    if (user.password !== password) {
      return;
    }
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const { rows } = await client.query(
      `
        SELECT *
        FROM users
        WHERE username=$1;
      `,
      [username]
    );
    if (!rows || !rows.length) {
      return null;
    }

    const [user] = rows;

    return user;
  } catch (error) {
    throw error;
  }
}

async function createUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
              INSERT INTO users(username, password)
              VALUES($1, $2)
              ON CONFLICT (username) DO NOTHING
              RETURNING id, username;
            `,
      [username, password]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT *
        FROM users
        WHERE id=$1;
      `,
      [userId]
    );
    if (!user) {
      return null;
    }
    delete user.password;
    return user;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername
};
