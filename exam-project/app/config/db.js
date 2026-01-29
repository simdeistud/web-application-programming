// db.js (utility for MongoDB)
const { MongoClient } = require('mongodb');

// ---- Config with sensible defaults for your setup ----
const MONGO_HOST = process.env.MONGO_HOST || 'mongo';
const MONGO_PORT = process.env.MONGO_PORT || '27017';
const MONGO_DB   = process.env.MONGO_DB   || 'exam-project';
const MONGO_USER = process.env.MONGO_USER || 'admin';        // created by init.js
const MONGO_PWD  = process.env.MONGO_PWD  || 'admin';        // created by init.js

// Important: authSource must be the DB where the user is defined (exam-project)
const URI = process.env.MONGO_URI ||
  `mongodb://${encodeURIComponent(MONGO_USER)}:${encodeURIComponent(MONGO_PWD)}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=${encodeURIComponent(MONGO_DB)}`;

// Driver options (tune as needed)
const OPTIONS = {
  // modern defaults
  maxPoolSize: Number(process.env.MONGO_MAX_POOL || 20),
  minPoolSize: Number(process.env.MONGO_MIN_POOL || 0),
  serverSelectionTimeoutMS: Number(process.env.MONGO_SSM_MS || 10000),
  // retryable writes need a replica set; harmless on single instance
  retryWrites: true,
};

let client;
let clientPromise;
let dbInstance;

/**
 * Connects once (idempotent). Safe to call from multiple modules concurrently.
 * Resolves when the driver is ready; returns the MongoClient.
 */
async function connect() {
  if (!clientPromise) {
    client = new MongoClient(URI, OPTIONS);
    clientPromise = (async () => {
      try {
        await client.connect();
        // Quick health check
        await client.db(MONGO_DB).command({ ping: 1 });
        dbInstance = client.db(MONGO_DB);
        return client;
      } catch (err) {
        // Clean up so a subsequent call can retry
        try { await client.close(); } catch (_) { /* noop */ }
        client = undefined;
        clientPromise = undefined;
        dbInstance = undefined;
        throw err;
      }
    })();
  }
  await clientPromise;
  return client;
}

/**
 * Returns the DB handle. Ensure connect() was awaited first.
 */
function getDb(name = MONGO_DB) {
  if (!client) {
    throw new Error('Mongo client not initialized. Call await connect() first.');
  }
  // Cache the requested DB for common case
  if (name === MONGO_DB && dbInstance) return dbInstance;
  return client.db(name);
}

/**
 * Convenience accessor for a collection in the default DB.
 */
function getCollection(collName, dbName = MONGO_DB) {
  return getDb(dbName).collection(collName);
}

/**
 * Closes the client and clears internal state.
 */
async function close() {
  if (client) {
    try {
      await client.close();
    } finally {
      client = undefined;
      clientPromise = undefined;
      dbInstance = undefined;
    }
  }
}

// Optional: graceful shutdown hooks (safe in most Node services)
function registerSignalHandlers() {
  const shutdown = async (signal) => {
    try {
      await close();
    } finally {
      process.exit(0);
    }
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

module.exports = {
  connect,
  getDb,
  getCollection,
  getClient: () => client,
  close,
  registerSignalHandlers,
};