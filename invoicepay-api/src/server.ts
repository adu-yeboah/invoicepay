import app from "./index.js";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.APP_PORT || 8000;

app.listen(PORT, () => {
  console.log("server started on http://localhost:${PORT}");
});
