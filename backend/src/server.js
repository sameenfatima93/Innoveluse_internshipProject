require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

connectDB(); 

const PORT = Number(process.env.PORT || 5000);

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});