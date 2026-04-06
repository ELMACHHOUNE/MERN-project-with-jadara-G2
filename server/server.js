require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const clientUrl = process.env.CLIENT_URL;

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", clientUrl);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/api", (req, res) => {
  res.json({
    message: "Hello from server API",
    success: true,
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
