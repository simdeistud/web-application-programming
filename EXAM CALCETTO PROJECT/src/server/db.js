// db.js
const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017';
let client;
let clientPromise;

/** Connect once and reuse the pooled MongoClient */
async function connect() {
  if (!clientPromise) {
    client = new MongoClient(uri, {
      // optional tuning:
      // maxPoolSize: 10,
      // serverSelectionTimeoutMS: 5000,
    });
    clientPromise = client.connect();
  }
  await clientPromise; // ensure ready
  return client;
}

/** Get a db handle (ensure connect() was called at startup) */
function getDb(name = 'calcetto') {
  if (!client) throw new Error('Mongo client not initialized. Call connect() first.');
  return client.db(name);
}

/** Close on shutdown */
async function close() {
  if (client) {
    await client.close();
    client = undefined;
    clientPromise = undefined;
  }
}

process.on('SIGINT', async () => {
  await close();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await close();
  process.exit(0);
});

module.exports = { connect, getDb, client: () => client, close };