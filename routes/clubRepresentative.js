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
        const clubinfo = await clubRepresentativeProcedures.clubRepresentativeViewRelatedInfoOfHisClub(req.session.username)
        .then((response) => {
          return response.recordset[0];
        });
        const upcomingmatches = await clubRepresentativeProcedures.clubRepresentativeViewUpcomingMatches(req.session.username)
        .then((response) => {
          return response.recordset;
        });
        // console.log("upcomingmatches");
        // console.log(upcomingmatches);
        // console.log("upcomingmatches"); 
        res.render("clubRepresentative/clubRepresentativeProfile", {
        title: "club Representative",
        username: req.session.username,
        club: clubinfo,
        matches: upcomingmatches,
        stadiums: null
      });
    },
  );


  router.post(
    "/getstadiums",
    authUser,
    authRole([ROLE.CLUB_REPRESENTATIVE]),
    async function (req, res, next) {
      const clubinfo = await clubRepresentativeProcedures.clubRepresentativeViewRelatedInfoOfHisClub(req.session.username)
      .then((response) => {
        return response.recordset[0];
      });
      const upcomingmatches = await clubRepresentativeProcedures.clubRepresentativeViewUpcomingMatches(req.session.username)
      .then((response) => {
        return response.recordset;
      });
        if(req.body.start_Date != undefined){
          date = req.body.start_Date + " 00:00:00.000";
        }
        const stadiumsinfo = await clubRepresentativeProcedures.clubRepresentativeViewAvailableStadiumsStartingAtCertainDate(req.session.username,date)
        .then((response) => {
          return response.recordset;
        });
        console.log("here-------------");
        console.log(stadiumsinfo);
      res.render("clubRepresentative/clubRepresentativeProfile",{
        title: "club Representative",
        username: req.session.username,
        club: clubinfo,
        matches: upcomingmatches,
        stadiums : stadiumsinfo
      });
    },
  );



module.exports = router;