const fs = require("fs");
const path = require("path");
const seedData = require("../data/seed");

const DB_FILE = path.join(__dirname, "..", "data", "db.json");
let dbCache = null;
let warnedWriteFailure = false;

function ensureDbFile() {
  if (!fs.existsSync(DB_FILE)) {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(seedData, null, 2), "utf-8");
  }
}

function readDb() {
  if (dbCache) {
    return dbCache;
  }

  ensureDbFile();
  const raw = fs.readFileSync(DB_FILE, "utf-8");
  dbCache = JSON.parse(raw);
  return dbCache;
}

function writeDb(data) {
  dbCache = data;

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    // Keep runtime data available even when filesystem write is blocked.
    if (!warnedWriteFailure) {
      warnedWriteFailure = true;
      console.warn(
        `[store] Could not write ${DB_FILE}. Using in-memory fallback for this run.`,
        error.message
      );
    }
  }
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
