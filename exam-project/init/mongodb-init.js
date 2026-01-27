// Switch to the target database
db = db.getSiblingDB("exam-project");

// Create application user
db.createUser({
  user: "admin",
  pwd: "admin",
  roles: [
    { role: "readWrite", db: "exam-project" }
  ]
});

// Create required collections
db.createCollection("users");
db.createCollection("fields");
db.createCollection("tournaments");
db.createCollection("matches");