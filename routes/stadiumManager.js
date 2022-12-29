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
    res.render("stadiumManager/stadiumManagerProfile", {
      title: "Stadium Manager",
      username: req.session.username,
    });
  },
);

router.get(
  "/stadiumDetails",
  authUser,
  authRole([ROLE.STADIUM_MANAGER]),
  async function (req, res, next) {
    const stadiumInfo = await stadiumProcedure
      .stadiumManagerViewRelatedInfoOfHisStadium(req.session.username)
      .then((response) => {
        return response.recordset[0];
      });

    res.render("stadiumManager/stadiumDetails", {
      title: "Stadium Manager",
      username: req.session.username,
      stadium: stadiumInfo,
    });
  },
);

router.get(
  "/viewRequests",
  authUser,
  authRole([ROLE.STADIUM_MANAGER]),
  async function (req, res, next) {
    const requests = await stadiumProcedure
      .stadiumManagerViewRequestsHeReceived(req.session.username)
      .then((response) => {
        return response.recordset;
      });

    console.log(requests, "requests in stadium manager");
    res.render("stadiumManager/hostingRequests", {
      title: "Stadium Manager",
      username: req.session.username,
      requests: requests,
    });
  },
);

router.post(
  "/acceptRequest/:representative_name/:host_club_name/:guest_club_name/:match_start_time",
  authUser,
  authRole([ROLE.STADIUM_MANAGER]),
  async function (req, res, next) {
    const host_club_name = req.params.host_club_name;
    const guest_club_name = req.params.guest_club_name;
    const match_start_time = req.params.match_start_time;

    const start_time = new Date(parseInt(match_start_time * 1000));
    console.log(start_time);
    const result = await stadiumProcedure
      .stadiumManagerAcceptRequest(
        req.session.username,
        host_club_name,
        guest_club_name,
        start_time,
      )
      .then((response) => {
        return response.returnValue;
      });
    if (result == 0) {
      console.log("done");
    }
    res.redirect("/stadiumManager");
  },
);

router.post(
  "/rejectRequest/:representative_name/:host_club_name/:guest_club_name/:match_start_time",
  authUser,
  authRole([ROLE.STADIUM_MANAGER]),
  async function (req, res, next) {
    const host_club_name = req.params.host_club_name;
    const guest_club_name = req.params.guest_club_name;
    const match_start_time = req.params.match_start_time;
    // const representative_name = req.params.representative_name;
    // console.log(representative_name, "name");
    // console.log(host_club_name);
    // console.log(guest_club_name);
    // console.log(match_start_time);
    const start_time = new Date(parseInt(match_start_time * 1000));
    console.log(start_time);
    const result = await stadiumProcedure
      .stadiumManagerRejectRequest(
        req.session.username,
        host_club_name,
        guest_club_name,
        start_time,
      )
      .then((response) => {
        return response.returnValue;
      });
    if (result == 0) {
      console.log("done");
    }
    res.redirect("/stadiumManager");
  },
);
module.exports = router;
