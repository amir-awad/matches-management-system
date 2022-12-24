const sql = require("mssql");

const sportsManagerRegister = async (name, username, password) => {
  const request = new sql.Request();
  request.input("name", sql.VarChar, name);
  request.input("username", sql.VarChar, username);
  request.input("password", sql.VarChar, password);
  const result = await request.execute("AssociationManagerRegister");
  return result;
};

const sportsManagerAddNewMatch = async (
  host_club_name,
  guest_club_name,
  start_date,
  end_date,
) => {
  const request = new sql.Request();
  request.input("host_club", sql.VarChar, host_club_name);
  request.input("guest_club", sql.VarChar, guest_club_name);
  request.input("start", sql.DateTime, start_date);
  request.input("end", sql.DateTime, end_date);
  const result = await request.execute("AssociationManagerAddNewMatch");
  return result;
};

const sportsManagerDeleteMatch = async (
  host_club_name,
  guest_club_name,
  start_date,
  end_date,
) => {
  const request = new sql.Request();
  request.input("host_club", sql.VarChar, host_club_name);
  request.input("guest_club", sql.VarChar, guest_club_name);
  request.input("start", sql.DateTime, start_date);
  request.input("end", sql.DateTime, end_date);
  const result = await request.execute("AssociationManagerDeleteMatch");
  return result;
};

const sportsManagerViewUpcomingMatches = async () => {
  const request = new sql.Request();
  const result = await request.execute("AssociationManagerViewUpcomingMatches");
  return result;
};

const sportsManagerViewPlayedMatches = async () => {
  const request = new sql.Request();
  const result = await request.execute("AssociationManagerViewPlayedMatches");
  return result;
};

const sportsManagerViewPairOfClubNamesWhoNeverScheduledToPlayWithEachOther =
  async () => {
    const request = new sql.Request();
    const result = await request.execute(
      "AssociationManagerViewPairOfClubNamesWhoNeverScheduledToPlayWithEachOther",
    );
    return result;
  };

module.exports = {
  sportsManagerRegister,
  sportsManagerAddNewMatch,
  sportsManagerDeleteMatch,
  sportsManagerViewUpcomingMatches,
  sportsManagerViewPlayedMatches,
  sportsManagerViewPairOfClubNamesWhoNeverScheduledToPlayWithEachOther,
};
