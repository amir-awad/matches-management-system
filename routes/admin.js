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

router.get(
  "/addClub",
  authUser,
  authRole([ROLE.SYSTEM_ADMIN]),
  function (req, res, next) {
    res.render("admin/addClub", {
      title: "Add Club",
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
      res.render("admin/addClub", {
        title: "Add Club",
        username: req.session.username,
      });
      console.log("Club added successfully!");
    } else {
      res.render("admin/addClub", {
        title: "Add Club",
        username: req.session.username,
      });
      console.log("Club Already Exists!");
    }

    req.session.type = 0;
  },
);

router.get(
  "/deleteClub",
  authUser,
  authRole([ROLE.SYSTEM_ADMIN]),
  function (req, res, next) {
    res.render("admin/deleteClub", {
      title: "Delete Club",
      username: req.session.username,
    });
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
      res.render("admin/deleteClub", {
        title: "Delete Club",
        username: req.session.username,
      });
      console.log("Club deleted successfully!");
    } else {
      res.render("admin/deleteClub", {
        title: "Delete Club",
        username: req.session.username,
      });
      console.log("Club does not exist!");
    }
    req.session.type = 0;
  },
);

router.get(
  "/addStadium",
  authUser,
  authRole([ROLE.SYSTEM_ADMIN]),
  function (req, res, next) {
    res.render("admin/addStadium", {
      title: "Add Stadium",
      username: req.session.username,
    });
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
      res.render("admin/addStadium", {
        title: "Add Stadium",
        username: req.session.username,
      });
      console.log("Stadium added successfully!");
    } else {
      res.render("admin/addStadium", {
        title: "Add Stadium",
        username: req.session.username,
      });
      console.log("Stadium Already Exists!");
    }
    req.session.type = 0;
  },
);

router.get(
  "/deleteStadium",
  authUser,
  authRole([ROLE.SYSTEM_ADMIN]),
  function (req, res, next) {
    res.render("admin/deleteStadium", {
      title: "Delete Stadium",
      username: req.session.username,
    });
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
      res.render("admin/deleteStadium", {
        title: "Delete Stadium",
        username: req.session.username,
      });
      console.log("Stadium deleted successfully!");
    } else {
      res.render("admin/deleteStadium", {
        title: "Delete Stadium",
        username: req.session.username,
      });
      console.log("Stadium does not exist!");
    }
    req.session.type = 0;
  },
);

router.get(
  "/blockFan",
  authUser,
  authRole([ROLE.SYSTEM_ADMIN]),
  function (req, res, next) {
    res.render("admin/blockFan", {
      title: "Block Fan",
      username: req.session.username,
    });
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
      res.render("admin/blockFan", {
        title: "Block Fan",
        username: req.session.username,
      });
      console.log("Fan blocked successfully!");
    } else {
      res.render("admin/blockFan", {
        title: "Block Fan",
        username: req.session.username,
      });
      console.log("Fan does not exist!");
    }
    req.session.type = 0;
  },
);

module.exports = router;
