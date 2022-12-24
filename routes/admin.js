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
    res.render("admin/adminDashboard", {
      title: "Admin",
      user: req.session.user,
    });
  },
);

router.get(
  "/addClub",
  authUser,
  authRole([ROLE.SYSTEM_ADMIN]),
  function (req, res, next) {
    res.render("admin/addClub", { title: "Add Club", user: req.session.user });
  },
);

router.post(
  "/addClub",
  authUser,
  authRole([ROLE.SYSTEM_ADMIN]),
  async function (req, res, next) {
    const { name, c_location } = req.body;
    const result = await adminProcedures.adminAddNewClub(name, c_location);
    if (result) {
      toast.success(req, "Club added successfully");
      res.redirect("/admin");
    } else {
      toast.error(req, "Club already exists");
      res.redirect("/admin/addClub");
    }
  },
);

router.get(
  "/deleteClub",
  authUser,
  authRole([ROLE.SYSTEM_ADMIN]),
  function (req, res, next) {
    res.render("admin/deleteClub", {
      title: "Delete Club",
      user: req.session.user,
    });
  },
);

router.post(
  "/deleteClub",
  authUser,
  authRole([ROLE.SYSTEM_ADMIN]),
  async function (req, res, next) {
    const { name } = req.body;
    const result = await adminProcedures.adminDeleteClub(name);
    if (result) {
      toast.success(req, "Club deleted successfully");
      res.redirect("/admin");
    } else {
      toast.error(req, "Club does not exist");
      res.redirect("/admin/deleteClub");
    }
  },
);

router.get(
  "/addStadium",
  authUser,
  authRole([ROLE.SYSTEM_ADMIN]),
  function (req, res, next) {
    res.render("admin/addStadium", {
      title: "Add Stadium",
      user: req.session.user,
    });
  },
);

router.post(
  "/addStadium",
  authUser,
  authRole([ROLE.SYSTEM_ADMIN]),
  async function (req, res, next) {
    const { name, location, capacity } = req.body;
    const result = await adminProcedures.adminAddNewStadium(
      name,
      location,
      capacity,
    );
    if (result) {
      toast.success(req, "Stadium added successfully");
      res.redirect("/admin");
    } else {
      toast.error(req, "Stadium already exists");
      res.redirect("/admin/addStadium");
    }
  },
);

router.get(
  "/deleteStadium",
  authUser,
  authRole([ROLE.SYSTEM_ADMIN]),
  function (req, res, next) {
    res.render("admin/deleteStadium", {
      title: "Delete Stadium",
      user: req.session.user,
    });
  },
);

router.post(
  "/deleteStadium",
  authUser,
  authRole([ROLE.SYSTEM_ADMIN]),
  async function (req, res, next) {
    const { name } = req.body;
    const result = await adminProcedures.adminDeleteStadium(name);
    if (result) {
      toast.success(req, "Stadium deleted successfully");
      res.redirect("/admin");
    } else {
      toast.error(req, "Stadium does not exist");
      res.redirect("/admin/deleteStadium");
    }
  },
);

router.get(
  "/blockFan",
  authUser,
  authRole([ROLE.SYSTEM_ADMIN]),
  function (req, res, next) {
    res.render("admin/blockFan", {
      title: "Block Fan",
      user: req.session.user,
    });
  },
);

router.post(
  "/blockFan",
  authUser,
  authRole([ROLE.SYSTEM_ADMIN]),
  async function (req, res, next) {
    const { username } = req.body;
    const result = await adminProcedures.adminBlockFan(username);
    if (result) {
      toast.success(req, "Fan blocked successfully");
      res.redirect("/admin");
    } else {
      toast.error(req, "Fan does not exist");
      res.redirect("/admin/blockFan");
    }
  },
);

module.exports = router;
