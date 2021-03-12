import dbConnection from "../utils/dbconnection";

export async function getUser(payload) {
  const client = await dbConnection();
  const database = client.db("alaskaki");
  const users = database.collection("users");
  const user = await users.findOne(payload);
  return user;
}

export async function insertUser(payload) {
  const client = await dbConnection();
  const database = client.db("alaskaki");
  const users = database.collection("users");
  const user = await users.insertOne(payload);
  return user;
}
