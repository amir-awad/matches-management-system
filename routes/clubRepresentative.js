const express = require("express");
const router = express.Router();
const clubRepresentativeProcedures = require("../procedures/clubRepresentativeProcedures");
const toast = require("../utilities/toast");
const { authUser, authRole, ROLE } = require("../utilities/auth");
router.get(
  "/",
  authUser,
  authRole([ROLE.CLUB_REPRESENTATIVE]),
  async function (req, res, next) {
    res.render("clubRepresentative/clubRepresentativeProfile", {
      title: "club Representative",
      username: req.session.username,
    });
  },
);

router.get(
  "/clubDetails",
  authUser,
  authRole([ROLE.CLUB_REPRESENTATIVE]),
  async function (req, res, next) {
    const clubInfo = await clubRepresentativeProcedures
      .clubRepresentativeViewRelatedInfoOfHisClub(req.session.username)
      .then((response) => {
        return response.recordset[0];
      });

    res.render("clubRepresentative/clubDetails", {
      title: "club Representative",
      username: req.session.username,
      club: clubInfo,
    });
  },
);

router.get(
  "/upcomingMatches",
  authUser,
  authRole([ROLE.CLUB_REPRESENTATIVE]),
  async function (req, res, next) {
    const clubInfo = await clubRepresentativeProcedures
      .clubRepresentativeViewRelatedInfoOfHisClub(req.session.username)
      .then((response) => {
        return response.recordset[0];
      });

    let upcoming_matches = await clubRepresentativeProcedures
      .clubRepresentativeViewUpcomingMatches(req.session.username)
      .then((response) => {
        return response.recordset;
      });

    async function update_upcoming_matches() {
      for (let i = 0; i < upcoming_matches.length; i++) {
        const stadium_name = await getStadiumNameOfMatch(
          upcoming_matches[i].stadium_id,
        );
        upcoming_matches[i].stadium_name = stadium_name;
      }
      return upcoming_matches;
    }

    upcoming_matches = await update_upcoming_matches();
    res.render("clubRepresentative/upcomingMatches", {
      title: "club Representative",
      username: req.session.username,
      matches: upcoming_matches,
      club: clubInfo,
    });
  },
);

async function getStadiumNameOfMatch(stadium_id) {
  if (stadium_id == null) return null;
  const stadiumName = await clubRepresentativeProcedures
    .clubRepresentativeGetStadiumNameOfMatch(stadium_id)
    .then((response) => {
      return response.recordset[0].stadium_name;
    });
  return stadiumName;
}

router.post(
  "/sendRequest/:host_club_name/:guest_club_name/:match_start_time",
  authUser,
  authRole([ROLE.CLUB_REPRESENTATIVE]),
  async function (req, res, next) {
    const host_club_name = req.params.host_club_name;
    const guest_club_name = req.params.guest_club_name;
    const match_start_time = req.params.match_start_time;
    const stadium_name = req.body.stadiumName;

    const start_time = new Date(parseInt(match_start_time * 1000));

    const stadium_manager_name = await clubRepresentativeProcedures
      .clubRepresentativeGetStadiumManagerNameGivenStadiumName(stadium_name)
      .then((response) => {
        return response.recordset[0].stadium_manager_name;
      });

    const result = await clubRepresentativeProcedures
      .clubRepresentativeSendRequestToStadiumManager(
        req.session.username,
        stadium_manager_name,
        host_club_name,
        guest_club_name,
        start_time,
      )
      .then((response) => {
        return response;
      });
    if (result) {
      console.log("request sent successfully");
    } else {
      console.log("failed to send request");
    }

    res.redirect("/clubRepresentative");
  },
);

router.get(
  "/availableStadiums",
  authUser,
  authRole([ROLE.CLUB_REPRESENTATIVE]),
  async function (req, res, next) {
    res.render("clubRepresentative/availableStadiums", {
      title: "club Representative",
      username: req.session.username,
      stadiums: [],
    });
  },
);

router.post(
  "/availableStadiums",
  authUser,
  authRole([ROLE.CLUB_REPRESENTATIVE]),
  async function (req, res, next) {
    const username = req.session.username;
    const date = req.body.date;
    const time = req.body.time;
    const start_time = date + " " + time;

    const stadiums = await clubRepresentativeProcedures
      .clubRepresentativeViewAvailableStadiumsStartingAtCertainDate(
        username,
        new Date(start_time),
      )
      .then((response) => {
        return response.recordset;
      });

    console.log(stadiums, "stadiums");
    res.render("clubRepresentative/availableStadiums", {
      title: "club Representative",
      username: req.session.username,
      stadiums: stadiums,
    });
  },
);

module.exports = router;
