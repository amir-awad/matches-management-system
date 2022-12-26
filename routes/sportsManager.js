const express = require("express");
const router = express.Router();
const sportsManagerProcedures = require("../procedures/sportsManagerProcedures");
const toast = require("../utilities/toast");
const { authUser, authRole, ROLE } = require("../utilities/auth");

router.get(
  "/",
  authUser,
  authRole([ROLE.SPORTS_ASSOCIATION_MANAGER]),
  function (req, res, next) {
    res.render("sportsManager/sportsManagerProfile", {
      title: "Sports Manager",
      username: req.session.username,
      upcoming_matches: "",
    });
  },
);

router.post(
  "/add-match",
  authUser,
  authRole([ROLE.SPORTS_ASSOCIATION_MANAGER]),
  async function (req, res, next) {
    const host_club_name = req.body.hostClubName;
    const guest_club_name = req.body.guestClubName;
    const start_time = req.body.startTime;
    const end_time = req.body.endTime;
    const result = await sportsManagerProcedures.sportsManagerAddNewMatch(
      host_club_name,
      guest_club_name,
      new Date(start_time),
      new Date(end_time),
    );

    console.log(result, "Sports manager add match result");

    if (result) {
      toast.showToast(req, "Match added successfully!");
      res.redirect("/sportsAssociationManager");
    } else {
      toast.showToast(req, "Match already exists!");
    }
  },
);

router.post(
  "/delete-match",
  authUser,
  authRole([ROLE.SPORTS_ASSOCIATION_MANAGER]),
  async function (req, res, next) {
    const host_club_name = req.body.hostClubName;
    const guest_club_name = req.body.guestClubName;
    const start_time = req.body.startTime;
    const end_time = req.body.endTime;
    const result = await sportsManagerProcedures.sportsManagerDeleteMatch(
      host_club_name,
      guest_club_name,
      new Date(start_time),
      new Date(end_time),
    );

    if (result) {
      toast.showToast(req, "Match deleted successfully!");
      res.redirect("/sportsAssociationManager");
    } else {
      toast.showToast(req, "Match does not exist!");
    }
  },
);

router.post(
  "/view-upcoming-matches",
  authUser,
  authRole([ROLE.SPORTS_ASSOCIATION_MANAGER]),
  async function (req, res, next) {
    const result =
      await sportsManagerProcedures.sportsManagerViewUpcomingMatches();

    if (result) {
      toast.showToast(req, "Matches are fetched successfully!");
      res.render("sportsManager/sportsManagerProfile", {
        title: "Sports Manager",
        username: req.session.username,
        upcoming_matches: result.recordset,
      });
    } else {
      toast.showToast(req, "Match can not be fetched!");
    }
  },
);

module.exports = router;
