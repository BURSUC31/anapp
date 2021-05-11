const express = require("express");
const https = require("https");
const http = require("http");
const path = require("path");
const fs = require("fs");
const app = express();
const httpsOptions = {
  cert: fs.readFileSync("./ssl/www_dimt_me.crt", { encoding: "utf-8" }),
  ca: fs.readFileSync("./ssl/www_dimt_me.ca-bundle", { encoding: "utf-8" }),
  key: fs.readFileSync("./ssl/www_dimt_me.kee"),
  passphrase: ".",
};

app.use((req, res, next) => {
  if (req.protocol === "http") {
    res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(httpsOptions, app);
const ejsMate = require("ejs-mate");
const { fstat } = require("fs");
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.get("/", (req, res) => {
  res.render("home");
});
app.use((req, res, next) => {
  if (req.protocol === "http") {
    res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});
httpServer.listen(80, "www.dimt.me");
httpsServer.listen(443, "www.dimt.me");
app.listen(80, () => console.log("connection open on port 80"));
