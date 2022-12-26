const express = require("express");
const router = express.Router();
const adminProcedures = require("../procedures/adminProcedures");
const toast = require("../utilities/toast");
const { authUser, authRole, ROLE } = require("../utilities/auth");

router.get(
  "/",
  authUser,
  authRole([ROLE.SYSTEM_ADMIN]),
  function (req, res, next) {
    res.render("admin/adminProfile", {
      title: "Admin",
      username: req.session.username,
    });
  },
);

router.post(
  "/addClub",
  authUser,
  authRole([ROLE.SYSTEM_ADMIN]),
  async function (req, res, next) {
    const name = req.body.clubName;
    const c_location = req.body.clubLocation;
    const result = await adminProcedures.adminAddNewClub(name, c_location);
    if (result) {
      // toast.showToast(req, "Club added successfully");
      res.redirect("/admin");
    } else {
      toast.showToast(req, "Club already exists");
      // res.redirect("/admin/addClub");
    }

    req.session.type = 0;
  },
);

router.post(
  "/deleteClub",
  authUser,
  authRole([ROLE.SYSTEM_ADMIN]),
  async function (req, res, next) {
    const name = req.body.clubName;
    console.log(name, "club name to delete");
    const result = await adminProcedures.adminDeleteClub(name);
    if (result) {
      // toast.showToast(req, "Club deleted successfully");
      res.redirect("/admin");
    } else {
      toast.showToast(req, "Club does not exist");
      // res.redirect("/admin/deleteClub");
    }
    req.session.type = 0;
  },
);

router.post(
  "/addStadium",
  authUser,
  authRole([ROLE.SYSTEM_ADMIN]),
  async function (req, res, next) {
    const name = req.body.stadiumName;
    const location = req.body.stadiumLocation;
    const capacity = req.body.stadiumCapacity;
    const result = await adminProcedures.adminAddNewStadium(
      name,
      location,
      capacity,
    );
    if (result) {
      toast.showToast(req, "Stadium added successfully");
      res.redirect("/admin");
    } else {
      toast.showToast(req, "Stadium already exists");
      // res.redirect("/admin/addStadium");
    }
    req.session.type = 0;
  },
);

router.post(
  "/deleteStadium",
  authUser,
  authRole([ROLE.SYSTEM_ADMIN]),
  async function (req, res, next) {
    const name = req.body.stadiumName;
    const result = await adminProcedures.adminDeleteStadium(name);
    if (result) {
      toast.showToast(req, "Stadium deleted successfully");
      res.redirect("/admin");
    } else {
      toast.showToast(req, "Stadium does not exist");
      // res.redirect("/admin/deleteStadium");
    }
    req.session.type = 0;
  },
);

router.post(
  "/blockFan",
  authUser,
  authRole([ROLE.SYSTEM_ADMIN]),
  async function (req, res, next) {
    const national_id = req.body.fanNationalId;
    const result = await adminProcedures.adminBlockFan(national_id);
    if (result) {
      toast.showToast(req, "Fan blocked successfully");
      res.redirect("/admin");
    } else {
      toast.showToast(req, "Fan does not exist");
      // res.redirect("/admin/blockFan");
    }
    req.session.type = 0;
  },
);

module.exports = router;
