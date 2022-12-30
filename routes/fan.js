const express = require("express");
const router = express.Router();
const fanProcedure = require("../procedures/fanProcedures");
const toast = require("../utilities/toast");
const { authUser, authRole, ROLE } = require("../utilities/auth");

router.get(
  "/",
  authUser,
  authRole([ROLE.FAN]),
  async function (req, res, next) {
    console.log("----------");

    const isBlocked = await checkIfFanIsBlocked(req.session.username).then(
      (result) => {
        return result;
      },
    );

    if (isBlocked) {
      res.redirect("/logout");
    } else {
      res.render("fan/fanProfile", {
        title: "Fan",
        username: req.session.username,
        matches: "",
      });
    }
  },
);

async function checkIfFanIsBlocked(username) {
  const result = await fanProcedure.fanGetStatus(username);
  return result;
}

router.get(
  "/viewMatchesWithAvailableTicketsStartingGivenDate",
  authUser,
  authRole([ROLE.FAN]),
  async function (req, res, next) {
    res.render("fan/fanViewAllMatches", {
      title: "Fan",
      username: req.session.username,
      matches: "",
    });
  },
);

router.post(
  "/viewMatchesWithAvailableTicketsStartingGivenDate",
  authUser,
  authRole([ROLE.FAN]),
  async function (req, res, next) {
    const date = req.body.date;
    const time = req.body.time;
    const start_time = date + " " + time;
    console.log(date, "date");
    const result =
      await fanProcedure.fanViewMatchesWithAvailableTicketsStartingGivenDate(
        new Date(start_time),
      );

    console.log(result, "result from view matches with available tickets");
    res.render("fan/fanViewAllMatches", {
      title: "Fan",
      username: req.session.username,
      matches: result.recordset,
    });
  },
);

router.post(
  "/purchaseTicket",
  authUser,
  authRole([ROLE.FAN]),
  async function (req, res, next) {
    console.log(req.body, "req.body from purchase ticket");

    let national_id = "";
    await fanProcedure
      .fanNationalIdFinder(req.session.username)
      .then((response) => {
        console.log(response, "response from national id finder");
        national_id = response.output.national_id;
      });

    const host_club_name = req.body.host_club_name;
    const guest_club_name = req.body.guest_club_name;
    const match_start_date = req.body.start_time;
console.log("hereee------");
    console.log(host_club_name);
    console.log(guest_club_name);
    console.log(match_start_date);
    const result = await fanProcedure.fanPurchaseTicket(
      national_id,
      host_club_name,
      guest_club_name,
      new Date(match_start_date),
    );
    console.log(result);
    if (result.returnValue === 0) {
      console.log("Ticket purchased successfully");
    } else {
      console.log("Ticket purchase failed");
    }

    res.render("fan/fanViewAllMatches", {
      title: "Fan",
      username: req.session.username,
      matches: "",
    });
  },
);

module.exports = router;
