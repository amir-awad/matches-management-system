const express = require("express");
const router = express.Router();
const stadiumProcedure = require("../procedures/stadiumManagerProcedures");
const toast = require("../utilities/toast");
const { authUser, authRole, ROLE } = require("../utilities/auth");

router.get(
  "/",
  authUser,
  authRole([ROLE.STADIUM_MANAGER]),
  async function (req, res, next) {
    const stadiumInfo = await stadiumProcedure
      .stadiumManagerViewRelatedInfoOfHisStadium(req.session.username)
      .then((response) => {
        console.log(response, "response of stadium info");
        return response.recordset[0];
      });

    const requests = await stadiumProcedure
      .stadiumManagerViewRequestsHeReceived(req.session.username)
      .then((response) => {
        console.log(response, "response of requests");
        return response.recordset;
      });

    console.log(stadiumInfo, "stadiumInfo");
    console.log(requests, "request");

    res.render("stadiumManager/stadiumManagerProfile", {
      title: "Stadium Manager",
      username: req.session.username,
      stadium: stadiumInfo,
      requests: requests,
    });
  },
);

module.exports = router;
