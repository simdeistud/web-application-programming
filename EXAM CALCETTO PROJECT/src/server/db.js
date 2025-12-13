const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function connect() {
  if (!client.isConnected()) {
    try {
      await client.connect();
    } finally {
      client.close();
    }
  }
}
connect().catch(console.log);
