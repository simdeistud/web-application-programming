db.createUser({
   user: "admin",
   pwd: "admin",
   roles: [{ role: "readWrite", db: "exam-project" }]
});
db = new Mongo().getDB("exam-project");
db.createCollection("users");
db.createCollection("fields");
db.createCollection("tournaments");
db.createCollection("matches");