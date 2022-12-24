const express = require("express");
const router = express.Router();
const toast = require("../utilities/toast");
const clubRepresentativeProcedures = require("../procedures/clubRepresentativeProcedures");
const fanProcedures = require("../procedures/fanProcedures");
const sportsManagerProcedures = require("../procedures/sportsManagerProcedures");
const stadiumManagerProcedures = require("../procedures/stadiumManagerProcedures");

router.get("/", function (req, res, next) {
  res.render("register");
});

router.post("/clubRepresentative", function (req, res) {
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  const clubName = req.body.clubName;

  clubRepresentativeProcedures
    .clubRepresentativeRegister(name, username, password, clubName)
    .then((result) => {
      if (result) {
        toast.showToast(req, "Club Representative registered successfully");
        res.redirect("/");
      } else {
        toast.showToast(req, "Club Representative already exists");
        res.redirect("back");
      }
    });
});

router.post("/fan", function (req, res) {
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  const nationalId = req.body.nationalId;
  const phoneNumber = req.body.phoneNumber;
  const birthDate = req.body.birthDate;
  const address = req.body.address;

  fanProcedures
    .fanRegister(
      name,
      username,
      password,
      nationalId,
      phoneNumber,
      birthDate,
      address,
    )
    .then((result) => {
      if (result) {
        toast.showToast(req, "Fan registered successfully");
        res.redirect("/");
      } else {
        toast.showToast(req, "Fan already exists");
        res.redirect("back");
      }
    });
});

router.post("/sportsManager", function (req, res) {
  console.log(req.body);
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;

  sportsManagerProcedures
    .sportsManagerRegister(name, username, password)
    .then((result) => {
      if (result) {
        toast.showToast(req, "Sports Manager registered successfully");
        res.redirect("/");
      } else {
        toast.showToast(req, "Sports Manager already exists");
        res.redirect("back");
      }
    });
});

router.post("/stadiumManager", function (req, res) {
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  const stadiumName = req.body.stadiumName;

  stadiumManagerProcedures
    .stadiumManagerRegister(name, username, password, stadiumName)
    .then((result) => {
      if (result) {
        toast.showToast(req, "Stadium Manager registered successfully");
        res.redirect("/");
      } else {
        toast.showToast(req, "Stadium Manager already exists");
        res.redirect("back");
      }
    });
});

module.exports = router;
