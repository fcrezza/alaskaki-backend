import {ObjectId} from "mongodb";

import service from "./main";

export async function getUser(payload) {
  if ("_id" in payload) {
    payload._id = ObjectId(payload._id);
  }

  const client = service.getClient();
  const database = client.db("alaskaki");
  const users = database.collection("users");
  const user = await users.findOne(payload);
  return user;
}

export async function insertUser(payload) {
  const client = service.getClient();
  const database = client.db("alaskaki");
  const users = database.collection("users");
  const user = await users.insertOne(payload);
  return user;
}
