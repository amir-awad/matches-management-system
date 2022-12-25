const express = require("express");
const router = express.Router();
const adminProcedures = require("../procedures/adminProcedures");
const toast = require("../utilities/toast");
const { authUser, authRole, ROLE } = require("../utilities/auth");

router.get("/", authUser, authRole([ROLE.STADIUM_MANAGER]), function (req, res, next) {  
    res.send("hello World")
  });



module.exports = router;
