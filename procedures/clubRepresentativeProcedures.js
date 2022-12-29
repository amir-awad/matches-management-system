const sql = require("mssql");

const clubRepresentativeRegister = async (
  name,
  username,
  password,
  clubName,
) => {
  const request = new sql.Request();
  request.input("name", sql.VarChar, name);
  request.input("username", sql.VarChar, username);
  request.input("password", sql.VarChar, password);
  request.input("club_name", sql.VarChar, clubName);
  const result = await request.execute("ClubRepresentativeRegister");
  return result;
};

const clubRepresentativeViewRelatedInfoOfHisClub = async (username) => {
  const request = new sql.Request();
  request.input("username", sql.VarChar, username);
  const result = await request.execute(
    "ClubRepresentativeViewRelatedInfoOfHisClub",
  );
  return result;
};

const clubRepresentativeViewUpcomingMatches = async (username) => {
  const request = new sql.Request();
  request.input("username", sql.VarChar, username);
  const result = await request.execute(
    "ClubRepresentativeViewUpcomingMatchesForHisClub",
  );
  console.log(result);
  return result;
};

const clubRepresentativeGetStadiumNameOfMatch = async (stadium_id) => {
  const request = new sql.Request();
  request.input("stadium_id", sql.Int, stadium_id);
  const result = await request.execute(
    "ClubRepresentativeGetStadiumNameOfMatch",
  );
  return result;
};

const clubRepresentativeViewAvailableStadiumsStartingAtCertainDate = async (
  username,
  date,
) => {
  const request = new sql.Request();
  request.input("username", sql.VarChar, username);
  request.input("date", sql.DateTime, date);
  const result = await request.execute(
    "ClubRepresentativeViewAvailableStadiumsStartingAtCertainDate",
  );
  return result;
};

const clubRepresentativeSendRequestToStadiumManager = async (
  username,
  stadium_manger_name,
  host_club_name,
  guest_club_name,
  match_start_date,
) => {
  const request = new sql.Request();
  request.input("username", sql.VarChar, username);
  request.input("stadium_mang", sql.VarChar, stadium_manger_name);
  request.input("host_club_name", sql.VarChar, host_club_name);
  request.input("guest_club_name", sql.VarChar, guest_club_name);
  request.input("start", sql.DateTime, match_start_date);
  request.output("success", sql.Bit);
  const result = await request.execute(
    "ClubRepresentativeSendRequestToStadiumManager",
  );

  console.log(result,"result from ClubRepresentativeSendRequestToStadiumManager");

  return result.output.success;
};

const clubRepresentativeGetStadiumManagerNameGivenStadiumName = async (
  stadium_name,
) => {
  const request = new sql.Request();
  request.input("stadium_name", sql.VarChar, stadium_name);
  const result = await request.execute(
    "ClubRepresentativeGetStadiumManagerNameGivenStadiumName",
  );
  return result;
};

module.exports = {
  clubRepresentativeRegister,
  clubRepresentativeViewRelatedInfoOfHisClub,
  clubRepresentativeViewUpcomingMatches,
  clubRepresentativeGetStadiumNameOfMatch,
  clubRepresentativeViewAvailableStadiumsStartingAtCertainDate,
  clubRepresentativeSendRequestToStadiumManager,
  clubRepresentativeGetStadiumManagerNameGivenStadiumName,
};
