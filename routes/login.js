const express = require("express");
const router = express.Router();
const { userLogin, userType } = require("../procedures/userProcedures");
const { ROLE } = require("../utilities/auth");

router.get("/", function (req, res, next) {
  routeUser(req, res);
});

router.post("/", function (req, res) {
  login(req, res, req.body.username, req.body.password);
});

async function login(req, res, username, password) {
  console.log(req.body, "req.body");
  console.log(username, password, "username, password");
  try {
    const user = await userLogin(username, password);
    console.log(user, "user");
    if (user) {
      req.session.username = username;
      userType(username).then((type) => {
        console.log(type, "type");
        req.session.type = type;
        routeUser(req, res);
      });
    } else {
      res.render("login", {
        title: "Login",
        error: "Invalid username or password",
      });
    }
  } catch (err) {
    console.log(err);
    res.render("login", {
      title: "Login",
      error: "Invalid username or password",
    });
  }
}

function routeUser(req, res) {
  console.log(req.session.type, "req.session.type")
  switch (req.session.type) {
    case ROLE.FAN:
      res.redirect("/fan");
      break;
    case ROLE.CLUB_REPRESENTATIVE:
      res.redirect("/clubRepresentative");
      break;
    case ROLE.SYSTEM_ADMIN:
      res.redirect("/admin");
      break;
    case ROLE.STADIUM_MANAGER:
      res.redirect("/stadiumManager");
      break;
    case ROLE.SPORTS_ASSOCIATION_MANAGER:
      res.redirect("/sportsAssociationManager");
      break;
    default:
      res.render("login", {
        title: "Login",
        error: "Invalid username or password",
      });
  }
}

module.exports = router;
