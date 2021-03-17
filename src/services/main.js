import {MongoClient} from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const service = {
  async init() {
    await client.connect();
    return client;
  },
  getClient() {
    return client;
  }
};

export default service;
