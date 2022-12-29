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
    });
  },
);

router.get(
  "/addMatch",
  authUser,
  authRole([ROLE.SPORTS_ASSOCIATION_MANAGER]),
  function (req, res, next) {
    res.render("sportsManager/addMatch", {
      title: "Sports Manager",
      username: req.session.username,
    });
  },
);

router.post(
  "/addMatch",
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

    if (result) {
      res.render("sportsManager/addMatch", {
        title: "Sports Manager",
        username: req.session.username,
      });
      console.log("Match added successfully!");
    } else {
      res.render("sportsManager/addMatch", {
        title: "Sports Manager",
        username: req.session.username,
      });
      console.log("Match can not be added!");
    }
  },
);

router.get(
  "/deleteMatch",
  authUser,
  authRole([ROLE.SPORTS_ASSOCIATION_MANAGER]),
  function (req, res, next) {
    res.render("sportsManager/deleteMatch", {
      title: "Sports Manager",
      username: req.session.username,
    });
  },
);

router.post(
  "/deleteMatch",
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
      res.render("sportsManager/deleteMatch", {
        title: "Sports Manager",
        username: req.session.username,
      });
      console.log("Match deleted successfully!");
    } else {
      res.render("sportsManager/deleteMatch", {
        title: "Sports Manager",
        username: req.session.username,
      });
      console.log("Match can not be deleted!");
    }
  },
);

router.get(
  "/viewUpcomingMatches",
  authUser,
  authRole([ROLE.SPORTS_ASSOCIATION_MANAGER]),
  async function (req, res, next) {
    res.render("sportsManager/viewUpcomingMatches", {
      title: "Sports Manager",
      username: req.session.username,
      upcoming_matches: "",
    });
  },
);

router.post(
  "/viewUpcomingMatches",
  authUser,
  authRole([ROLE.SPORTS_ASSOCIATION_MANAGER]),
  async function (req, res, next) {
    const result =
      await sportsManagerProcedures.sportsManagerViewUpcomingMatches();

    if (result) {
      console.log("Matches are fetched successfully!");
      res.render("sportsManager/viewUpcomingMatches", {
        title: "Sports Manager",
        username: req.session.username,
        upcoming_matches: result.recordset,
      });
    } else {
      console.log("Match can not be fetched!");
      res.render("sportsManager/viewUpcomingMatches", {
        title: "Sports Manager",
        username: req.session.username,
        upcoming_matches: "",
      });
    }
  },
);

router.get(
  "/viewAlreadyPlayedMatches",
  authUser,
  authRole([ROLE.SPORTS_ASSOCIATION_MANAGER]),
  async function (req, res, next) {
    res.render("sportsManager/viewAlreadyPlayedMatches", {
      title: "Sports Manager",
      username: req.session.username,
      played_matches: "",
    });
  },
);

router.post(
  "/viewAlreadyPlayedMatches",
  authUser,
  authRole([ROLE.SPORTS_ASSOCIATION_MANAGER]),
  async function (req, res, next) {
    const result =
      await sportsManagerProcedures.sportsManagerViewPlayedMatches();

    if (result) {
      console.log("Matches are fetched successfully!");
      res.render("sportsManager/viewAlreadyPlayedMatches", {
        title: "Sports Manager",
        username: req.session.username,
        played_matches: result.recordset,
      });
    } else {
      console.log("Match can not be fetched!");
      res.render("sportsManager/viewAlreadyPlayedMatches", {
        title: "Sports Manager",
        username: req.session.username,
        played_matches: "",
      });
    }
  },
);

router.get(
  "/viewNeverPlayedClubs",
  authUser,
  authRole([ROLE.SPORTS_ASSOCIATION_MANAGER]),
  async function (req, res, next) {
    res.render("sportsManager/viewNeverPlayedClubs", {
      title: "Sports Manager",
      username: req.session.username,
      never_played_clubs: "",
    });
  },
);

router.post(
  "/viewNeverPlayedClubs",
  authUser,
  authRole([ROLE.SPORTS_ASSOCIATION_MANAGER]),
  async function (req, res, next) {
    const result = await removeClubsFromNeverPlayedMatches(
      await sportsManagerProcedures.sportsManagerViewPairOfClubNamesWhoNeverScheduledToPlayWithEachOther(),
    );

    if (result) {
      console.log("CLubs are fetched successfully!");
      res.render("sportsManager/viewNeverPlayedClubs", {
        title: "Sports Manager",
        username: req.session.username,
        never_played_clubs: result.recordset,
      });
    } else {
      console.log("Club can not be fetched!");
      res.render("sportsManager/viewNeverPlayedClubs", {
        title: "Sports Manager",
        username: req.session.username,
        never_played_clubs: "",
      });
    }
  },
);

async function removeClubsFromNeverPlayedMatches(never_played_clubs) {
  const upcoming_matches =
    await sportsManagerProcedures.sportsManagerViewUpcomingMatches();
  const played_matches =
    await sportsManagerProcedures.sportsManagerViewPlayedMatches();

  console.log(
    never_played_clubs.recordset,
    "never played clubs before removing",
  );

  for (let i = 0; i < never_played_clubs.recordset.length; i++) {
    for (let j = 0; j < upcoming_matches.recordset.length; j++) {
      if (
        never_played_clubs.recordset[i] !== null &&
        upcoming_matches.recordset[j] !== null &&
        never_played_clubs.recordset[i].host_club_name ===
          upcoming_matches.recordset[j].guest_club_name &&
        never_played_clubs.recordset[i].guest_club_name ===
          upcoming_matches.recordset[j].host_club_name
      ) {
        console.log("upcoming matches", upcoming_matches.recordset[j]);
        never_played_clubs.recordset[i] = null;
      }
    }
  }

  for (let i = 0; i < never_played_clubs.recordset.length; i++) {
    for (
      let j = 0;
      j < played_matches.recordset.length &&
      never_played_clubs.recordset[i] != null;
      j++
    ) {
      if (
        never_played_clubs.recordset[i].host_club_name ===
          played_matches.recordset[j].guest_club_name &&
        never_played_clubs.recordset[i].guest_club_name ===
          played_matches.recordset[j].host_club_name
      ) {
        never_played_clubs.recordset[i] = null;
      }
    }
  }

  for (let i = 0; i < never_played_clubs.recordset.length; i++) {
    for (let j = 0; j < never_played_clubs.recordset.length; j++) {
      if (
        never_played_clubs.recordset[i] != null &&
        never_played_clubs.recordset[j] != null &&
        never_played_clubs.recordset[i].host_club_name ===
          never_played_clubs.recordset[j].guest_club_name &&
        never_played_clubs.recordset[i].guest_club_name ===
          never_played_clubs.recordset[j].host_club_name
      ) {
        never_played_clubs.recordset[j] = null;
      }
    }
  }

  console.log(
    never_played_clubs.recordset,
    "never played clubs after removing",
  );

  return never_played_clubs;
}

module.exports = router;
