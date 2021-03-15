import {MongoClient} from "mongodb";

const uri = "mongodb://127.0.0.1:27017";
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
