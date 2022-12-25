const sql = require("mssql");

const stadiumManagerRegister = async (
  name,
  username,
  password,
  stadiumName,
) => {
  const request = new sql.Request();
  request.input("name", sql.VarChar, name);
  request.input("username", sql.VarChar, username);
  request.input("password", sql.VarChar, password);
  request.input("stadium_name", sql.VarChar, stadiumName);
  const result = await request.execute("StadiumManagerRegister");
  return result;
};

const   stadiumManagerViewRelatedInfoOfHisStadium = async (username) => {
  const request = new sql.Request();
  request.input("username", sql.VarChar, username);
  const result = await request.execute(
    "StadiumManagerViewRelatedInfoOfHisStadium",
  );
  return result;
};

const stadiumManagerViewRequestsHeReceived = async (username) => {
  const request = new sql.Request();
  request.input("username", sql.VarChar, username);
  const result = await request.execute("StadiumManagerViewRequestsHeReceived");
  return result;
};

const stadiumManagerAcceptRequest = async (
  username,
  host_club_name,
  guest_club_name,
  match_start_date,
) => {
  const request = new sql.Request();
  request.input("stadium_mang", sql.VarChar, username);
  request.input("host_club_name", sql.VarChar, host_club_name);
  request.input("guest_club_name", sql.VarChar, guest_club_name);
  request.input("start", sql.DateTime, match_start_date);
  const result = await request.execute("StadiumManagerAcceptRequest");
  return result;
};

const stadiumManagerRejectRequest = async (
  username,
  host_club_name,
  guest_club_name,
  match_start_date,
) => {
  const request = new sql.Request();
  request.input("stadium_mang", sql.VarChar, username);
  request.input("host_club_name", sql.VarChar, host_club_name);
  request.input("guest_club_name", sql.VarChar, guest_club_name);
  request.input("start", sql.DateTime, match_start_date);
  const result = await request.execute("StadiumManagerRejectRequest");
  return result;
};

module.exports = {
  stadiumManagerRegister,
  stadiumManagerViewRelatedInfoOfHisStadium,
  stadiumManagerViewRequestsHeReceived,
  stadiumManagerAcceptRequest,
  stadiumManagerRejectRequest,
};
