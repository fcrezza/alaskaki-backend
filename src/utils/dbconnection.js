import {MongoClient} from "mongodb";

async function dbConnection() {
  const uri = "mongodb://127.0.0.1:27017";
  const client = new MongoClient(uri);
  await client.connect();
  return client;
}

export default dbConnection;
