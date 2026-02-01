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
ensureCollection(appDb, "slots");
ensureCollection(appDb, "teams");

appDb.fields.createIndex({ name: "text", type: "text" });
appDb.teams.createIndex({ name: "text" });
appDb.users.createIndex({ name: "text", surname: "text", username: "text" });

appDb.fields.insertOne({
  name: "Sample Football Field",
  type: "Soccer",
  description: "A standard soccer field.",
  address: "123 Soccer St, Sportstown",
  img_uri: `http://localhost:${process.env.WEB_PORT || 3000}/img/fields/field.jpg`,
  opening_time: "08:00",
  closing_time: "22:00"
});

appDb.fields.insertOne({
  name: "Sample Basketball Field",
  type: "Basketball",
  description: "A second standard basketball field.",
  address: "123 Basket St, Sportstown",
  img_uri: `http://localhost:${process.env.WEB_PORT || 3000}/img/fields/field2.jpg`,
  opening_time: "08:01",
  closing_time: "22:01"
});

appDb.slots.insertMany([
  {
    field_id: appDb.fields.findOne({ name: "Sample Football Field" })._id,
    slot_date: "2026-02-20",
    start_time: "10:00",
    end_time: "11:00",
  },
  {
    field_id: appDb.fields.findOne({ name: "Sample Football Field" })._id,
    slot_date: "2026-02-20",
    start_time: "11:00",
    end_time: "12:00",
  },
  {
    field_id: appDb.fields.findOne({ name: "Sample Basketball Field" })._id,
    slot_date: "2026-02-20",
    start_time: "10:00",
    end_time: "11:00",
  },
  {
    field_id: appDb.fields.findOne({ name: "Sample Basketball Field" })._id,
    slot_date: "2026-01-20",
    start_time: "10:00",
    end_time: "11:00",
  }
]);

appDb.teams.insertMany([
  {
    name: "Team A",
    players: [{
      name: "Alice",
      surname: "Anderson",
      jersey: 9,
    }, {
      name: "Aaron",
      surname: "Avery",
      jersey: 10,
    }],
    creator: "test",
  },
  {
    name: "Team B",
    players: [{
      name: "Bob",
      surname: "Brown",
      jersey: 7,
    }, {
      name: "Bella",
      surname: "Benson",
    }],
    creator: "test",
  },
]);

appDb.tournaments.insertOne({
  name: "Sample Football Tournament",
  sport_type: "Football",
  start_date: new Date("2026-10-02"),
  max_teams: 5,
  creator: "test",
});



print("Initialization completed.");