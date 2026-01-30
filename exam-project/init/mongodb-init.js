// init.js

// --- Config ---
const DB_NAME = "exam-project";
const APP_USER = "admin";
const APP_PWD = "admin";

// --- Select app DB ---
const appDb = db.getSiblingDB(DB_NAME);

// --- Ensure application user ---
try {
  const existingUser = appDb.getUser(APP_USER);
  if (!existingUser) {
    appDb.createUser({
      user: APP_USER,
      pwd: APP_PWD,
      roles: [{ role: "readWrite", db: DB_NAME }],
    });
    print(`Created user '${APP_USER}' on '${DB_NAME}'.`);
  } else {
    const hasRW = (existingUser.roles || []).some(r => r.role === "readWrite" && r.db === DB_NAME);
    if (!hasRW) {
      appDb.grantRolesToUser(APP_USER, [{ role: "readWrite", db: DB_NAME }]);
      print(`Granted readWrite to '${APP_USER}' on '${DB_NAME}'.`);
    } else {
      print(`User '${APP_USER}' already present with readWrite on '${DB_NAME}'.`);
    }
  }
} catch (e) {
  print(`User ensure failed: ${e}`);
}

// --- Helper: ensure collection exists using listCollections ---
function ensureCollection(dbRef, collName, options) {
  const exists = dbRef.getCollectionNames
    ? dbRef.getCollectionNames().indexOf(collName) !== -1 // legacy shell fallback
    : dbRef.listCollections({ name: collName }, { nameOnly: true }).hasNext();

  if (!exists) {
    dbRef.createCollection(collName, options || {});
    print(`Created collection '${collName}'.`);
  } else {
    print(`Collection '${collName}' already exists.`);
  }
}

// --- Create required collections ---
ensureCollection(appDb, "users");
ensureCollection(appDb, "fields");
ensureCollection(appDb, "tournaments");
ensureCollection(appDb, "matches");

appDb.fields.insertOne({
  name: "Sample Field",
  type: "Soccer",
  description: "A standard soccer field.",
  address: "123 Soccer St, Sportstown",
  img_uri: `http://localhost:${process.env.WEB_PORT || 3000}/img/fields/field.jpg`,
  opening_time: "08:00",
  closing_time: "22:00"
});

appDb.fields.insertOne({
  name: "Sample Field2",
  type: "Basketball",
  description: "A second standard basketball field.",
  address: "123 Basket St, Sportstown",
  img_uri: `http://localhost:${process.env.WEB_PORT || 3000}/img/fields/field2.jpg`,
  opening_time: "08:01",
  closing_time: "22:01"
});

print("Initialization completed.");