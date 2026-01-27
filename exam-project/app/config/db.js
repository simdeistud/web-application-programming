// db.js
const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017';
let client;
let clientPromise;

async function connect() {
  if (!clientPromise) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  await clientPromise; // ensure ready
  return client;
}

function getDb(name = 'exam-project') {
  if (!client) throw new Error('Mongo client not initialized. Call connect() first.');
  return client.db(name);
}

async function close() {
  if (client) {
    await client.close();
    client = undefined;
    clientPromise = undefined;
  }
}

module.exports = { connect, getDb, client: () => client, close };