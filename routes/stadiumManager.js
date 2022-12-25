const express = require("express");
const router = express.Router();
const adminProcedures = require("../procedures/adminProcedures");
const stadiumProcedure = require("../procedures/stadiumManagerProcedures");
const toast = require("../utilities/toast");
const { authUser, authRole, ROLE } = require("../utilities/auth");

router.get("/", authUser, authRole([ROLE.STADIUM_MANAGER]), function (req, res, next) {  
    res.send("hello World")
    stadiumProcedure.stadiumManagerViewRelatedInfoOfHisStadium().then((response) => {
        res.render("stadiumManager/stadiumManagerProfile", {
            title: "Stadium Manager",
            username: req.session.username,
            
          });
    });
  });



module.exports = router;
