const express = require("express");
const router = express.Router();
const sportsManagerProcedures = require("../procedures/adminProcedures");
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
    });
  },
);

router.post(
  "/add-match",
  authUser,
  authRole([ROLE.SPORTS_ASSOCIATION_MANAGER]),
  async function (req, res, next) {
    const host_club_name = req.body.hostClubName;
    const guest_club_name = req.body.guest_club_name;
    const start_time = req.body.startTime;
    const end_time = req.body.endTime;
    const result = await sportsManagerProcedures.sportsManagerAddNewMatch(
      host_club_name,
      guest_club_name,
      start_time,
      end_time,
    );

    if (result) {
      toast.showToast("Match added successfully!");
      res.redirect("sportsAssociationManager");
    } else {
      toast.showToast("Match already exists!");
    }
  },
);

module.exports = router;
