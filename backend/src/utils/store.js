const seedData = require("../data/seed");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Coupon = require("../models/Coupon");
const Notification = require("../models/Notification");

let seedPromise = null;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getCollections() {
  return {
    users: User,
    products: Product,
    orders: Order,
    coupons: Coupon,
    notifications: Notification,
  };
}

async function ensureSeeded() {
  if (!seedPromise) {
    seedPromise = (async () => {
      const collections = getCollections();
      const keys = Object.keys(collections);

      await Promise.all(
        keys.map(async (key) => {
          const Model = collections[key];
          const count = await Model.countDocuments();
          if (count === 0 && Array.isArray(seedData[key]) && seedData[key].length > 0) {
            await Model.insertMany(seedData[key]);
          }
        })
      );
    })();
  }

  return seedPromise;
}

async function readDb() {
  await ensureSeeded();
  const collections = getCollections();
  const entries = await Promise.all(
    Object.entries(collections).map(async ([key, Model]) => {
      const docs = await Model.find({}, { _id: 0, __v: 0 }).sort({ createdAt: -1, id: -1 }).lean();
      return [key, docs];
    })
  );

  return Object.fromEntries(entries);
}

async function writeDb(data) {
  await ensureSeeded();
  const collections = getCollections();

  await Promise.all(
    Object.entries(collections).map(async ([key, Model]) => {
      await Model.deleteMany({});

      if (Array.isArray(data[key]) && data[key].length > 0) {
        await Model.insertMany(data[key]);
      }
    })
  );

  return readDb();
}

async function updateDb(mutator) {
  const db = await readDb();
  const draft = clone(db);
  const nextDb = (await mutator(draft)) || draft;
  return writeDb(nextDb);
}

module.exports = {
  readDb,
  writeDb,
  updateDb,
};
