require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = Number(process.env.PORT || 5000);

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
}

startServer();
