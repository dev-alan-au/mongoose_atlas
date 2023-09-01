var express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser").json();
// const https = require("https");
// const http = require("http");
require("dotenv").config();
require("./models/User");
require("./config/passport");

const authRouter = require("./routes/auth");
const registrationRouter = require("./routes/signup");

async function main() {
  const username = process.env.DB_ADMIN_USERNAME;
  const password = process.env.DB_ADMIN_PASSWORD;
  const connectionStr = `mongodb+srv://${username}:${password}@cluster0.rxomr5o.mongodb.net/?retryWrites=true&w=majority`;
  await mongoose.connect(connectionStr);

  console.log("Connected to Atlas");
}

const app = express();
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser);
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/user", registrationRouter);

// http.createServer(app).listen(httpPort);
// https.createServer(options, app).listen(443)

// Creating server
const port = 3000;
main().catch((err) => console.log(err));

app.listen(port, () => {
  console.log("Server running at port: " + port);
});
