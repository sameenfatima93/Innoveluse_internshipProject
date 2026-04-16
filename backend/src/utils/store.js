const fs = require("fs");
const path = require("path");
const seedData = require("../data/seed");

const DB_FILE = path.join(__dirname, "..", "data", "db.json");

function ensureDbFile() {
  if (!fs.existsSync(DB_FILE)) {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(seedData, null, 2), "utf-8");
  }
}

function readDb() {
  ensureDbFile();
  const raw = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function updateDb(mutator) {
  const db = readDb();
  const nextDb = mutator(db) || db;
  writeDb(nextDb);
  return nextDb;
}

module.exports = {
  readDb,
  writeDb,
  updateDb,
};
