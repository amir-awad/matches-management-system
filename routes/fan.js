const express = require("express");
const router = express.Router();
const fanProcedure = require("../procedures/fanProcedures");
const toast = require("../utilities/toast");
const { authUser, authRole, ROLE } = require("../utilities/auth");

router.get("/", authUser, authRole([ROLE.FAN]), function (req, res, next) {
  res.render("fan/fanDashboard", { title: "Fan", user: req.session.user });
});

router.get(
  "/fanViewMatchesWithAvailableTicketsStartingGivenDate",
  authUser,
  authRole([ROLE.FAN]),
  async function (req, res, next) {
    const { date } = req.body;
    const result =
      await fanProcedure.fanViewMatchesWithAvailableTicketsStartingGivenDate(
        date,
      );
    res.render("fan/fanViewMatchesWithAvailableTicketsStartingGivenDate", {
      title: "Fan",
      user: req.session.user,
      result,
    });
  },
);

router.post(
  "/purchaseTicket",
  authUser,
  authRole([ROLE.FAN]),
  async function (req, res, next) {
    const national_id = req.session.user.national_id;
    const host_club_name = req.body.host_club_name;
    const guest_club_name = req.body.guest_club_name;
    const match_start_date = req.body.start;

    const result = await fanProcedure.fanPurchaseTicket(
      national_id,
      host_club_name,
      guest_club_name,
      match_start_date,
    );
    if (result) {
      toast.showToast(req, "Ticket purchased successfully");
      res.redirect("/fan");
    } else {
      toast.showToast(req, "Ticket not purchased");
      res.redirect("/fan");
    }
  },
);

module.exports = router;
