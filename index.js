const sql = require("mssql");
const express = require("express");
const app = express();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const logger = require("morgan");
const moment = require("moment");
const { StatusCodes } = require("http-status-codes");

require("dotenv").config();
const config = {
  user: process.env.DB_USER_ADMIN,
  password: process.env.DB_PASS_ADMIN,
  server: "db",
  database: "myDB",
  options: {
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};

const connect = async () => {
  try {
    await sql.connect(config);
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }
};

// routes
const loginRoute = require("./routes/login");
const logoutRoute = require("./routes/logout");
const registerRoute = require("./routes/register");
const adminRoute = require("./routes/admin");
const fanRoute = require("./routes/fan");
const clubRepresentativeRoute = require("./routes/clubRepresentative");
const sportsManagerRoute = require("./routes/sportsManager");
const stadiumManagerRoute = require("./routes/stadiumManager");

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  }),
);
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));
app.use("/", express.static(path.join(__dirname + "public")));

app.use("/", loginRoute);
app.use("/logout", logoutRoute);
app.use("/register", registerRoute);
app.use("/admin", adminRoute);
app.use("/fan", fanRoute);
app.use("/clubRepresentative", clubRepresentativeRoute);
app.use("/sportsManager", sportsManagerRoute);
app.use("/stadiumManager", stadiumManagerRoute);

app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).render("error", {
    title: "404 NOT FOUND",
    message: "Error 404 : Page Not Found",
  });
});

app.locals = {
  app: app,
  toastState: "",
  toastMessage: "",
  moment: moment,
};

const port = process.env.PORT || 8080;
app.listen(
  port,'0.0.0.0',
  connect().then(() => {
    console.log(`Listening on port ${port}`);

    // query to select all users
    const request = new sql.Request();
    request.query("SELECT * FROM users", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result.recordset);
      }
    });
  }),
);
