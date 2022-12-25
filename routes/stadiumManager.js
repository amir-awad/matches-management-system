const express = require("express");
const router = express.Router();
const stadiumProcedure = require("../procedures/stadiumManagerProcedures");
const toast = require("../utilities/toast");
const { authUser, authRole, ROLE } = require("../utilities/auth");

router.get(
  "/",
  authUser,
  authRole([ROLE.STADIUM_MANAGER]),
  function (req, res, next) {
    stadiumProcedure
      .stadiumManagerViewRelatedInfoOfHisStadium(req.session.username)
      .then((response) => {
        console.log(response, "response");
        res.render("stadiumManager/stadiumManagerProfile", {
          title: "Stadium Manager",
          username: req.session.username,
          stadium: response.recordset[0],
        });
      });
  },
);

module.exports = router;
