const sql = require("mssql");
const express = require("express");
const app = express();

const config = {
  user: "sa",
  password: "Amir@1234567",
  server: "db",
  database: "master",
  options: {
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};

app.get("/", (req, res) => {
  res.send("Hello Merooo!");
  sql.connect(config, function (err) {
    if (err) console.log(err);
    console.log("Connected to database");
  });
});

app.listen(8080, () => {
  console.log("Example app listening on port 8080!");
});
