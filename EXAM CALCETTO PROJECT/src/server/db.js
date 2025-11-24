const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function connect() {
  try {
    await client.connect();
  } finally {
    await client.close();
  }
}
connect().catch(console.log);