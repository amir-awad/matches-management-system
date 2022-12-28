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
    const clubinfo = await clubRepresentativeProcedures
      .clubRepresentativeViewRelatedInfoOfHisClub(req.session.username)
      .then((response) => {
        return response.recordset[0];
      });
    let upcomingmatches = await clubRepresentativeProcedures
      .clubRepresentativeViewUpcomingMatches(req.session.username)
      .then((response) => {
        return response.recordset;
      });

    async function update_upcomingmatches() {
      for (let i = 0; i < upcomingmatches.length; i++) {
        const stadium_name = await getStadiumNameOfMatch(
          upcomingmatches[i].stadium_id,
        );
        upcomingmatches[i].stadium_name = stadium_name;
      }

      return upcomingmatches;
    }

    upcomingmatches = await update_upcomingmatches();
    console.log(upcomingmatches, "club representative club upcoming matches");

    res.render("clubRepresentative/clubRepresentativeProfile", {
      title: "club Representative",
      username: req.session.username,
      club: clubinfo,
      matches: upcomingmatches,
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
  "/getstadiums",
  authUser,
  authRole([ROLE.CLUB_REPRESENTATIVE]),
  async function (req, res, next) {
    const clubinfo = await clubRepresentativeProcedures
      .clubRepresentativeViewRelatedInfoOfHisClub(req.session.username)
      .then((response) => {
        return response.recordset[0];
      });
    const upcomingmatches = await clubRepresentativeProcedures
      .clubRepresentativeViewUpcomingMatches(req.session.username)
      .then((response) => {
        return response.recordset;
      });
    if (req.body.start_Date != undefined) {
      date = req.body.start_Date + " 00:00:00.000";
    }
    const stadiumsinfo = await clubRepresentativeProcedures
      .clubRepresentativeViewAvailableStadiumsStartingAtCertainDate(
        req.session.username,
        date,
      )
      .then((response) => {
        return response.recordset;
      });
    console.log("here-------------");
    console.log(stadiumsinfo);
    res.render("clubRepresentative/clubRepresentativeProfile", {
      title: "club Representative",
      username: req.session.username,
      club: clubinfo,
      matches: upcomingmatches,
      stadiums: stadiumsinfo,
    });
  },
);

module.exports = router;
