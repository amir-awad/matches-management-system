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
    const clubInfo = await clubRepresentativeProcedures
      .clubRepresentativeViewRelatedInfoOfHisClub(req.session.username)
      .then((response) => {
        return response.recordset[0];
      });

    res.render("clubRepresentative/clubRepresentativeProfile", {
      title: "club Representative",
      username: req.session.username,
      club: clubInfo,
      matches: "",
      stadiums: null,
    });
  },
);

router.post(
  "/view-upcoming-matches",
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
    res.render("clubRepresentative/clubRepresentativeProfile", {
      title: "club Representative",
      username: req.session.username,
      club: clubInfo,
      matches: upcoming_matches,
      stadiums: null,
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
  "/view-available-stadiums",
  authUser,
  authRole([ROLE.CLUB_REPRESENTATIVE]),
  async function (req, res, next) {
    const username = req.session.username;
    const start_time = req.body.startTime;

    const stadiums = await clubRepresentativeProcedures
      .clubRepresentativeViewAvailableStadiumsStartingAtCertainDate(
        username,
        new Date(start_time),
      )
      .then((response) => {
        return response.recordset;
      });

    console.log(stadiums, "stadiums");

    const clubInfo = await clubRepresentativeProcedures
      .clubRepresentativeViewRelatedInfoOfHisClub(req.session.username)
      .then((response) => {
        return response.recordset[0];
      });

    res.render("clubRepresentative/clubRepresentativeProfile", {
      title: "club Representative",
      username: req.session.username,
      club: clubInfo,
      matches: "",
      stadiums: stadiums,
    });
  },
);

module.exports = router;
