const sql = require("mssql");

const fanRegister = async (
  name,
  username,
  password,
  nationalId,
  phoneNumber,
  birthDate,
  address,
) => {
  const request = new sql.Request();
  request.input("name", sql.VarChar, name);
  request.input("username", sql.VarChar, username);
  request.input("password", sql.VarChar, password);
  request.input("national_id", sql.VarChar, nationalId);
  request.input("phone_number", sql.VarChar, phoneNumber);
  request.input("birth_date", sql.VarChar, birthDate);
  request.input("fan_address", sql.VarChar, address);
  const result = await request.execute("FanRegister");
  return result;
};

const fanViewMatchesWithAvailableTicketsStartingGivenDate = async (date) => {
  console.log("here");
  const request = new sql.Request();
  request.input("date", sql.VarChar, date);
  const result = await request.execute(
    "FanViewMatchesWithAvailableTicketsStartingGivenDate",
  );
  console.log(result);
  return result;
};

const fanPurchaseTicket = async (
  nationalId,
  host_club_name,
  guest_club_name,
  start,
) => {
  const request = new sql.Request();
  request.input("national_id", sql.VarChar, nationalId);
  request.input("host_club", sql.VarChar, host_club_name);
  request.input("guest_club", sql.VarChar, guest_club_name);
  request.input("start", sql.DateTime, start);
  const result = await request.execute("FanPurchaseTicket");
  return result;
};

const fanNationalIdFinder = async (username) => {
  const request = new sql.Request();
  request.input("username", sql.VarChar, username);
  request.output("national_id", sql.VarChar);
  const result = await request.execute("FanNationalIdFinder");
  console.log(result, "FanNationalIdFinder");
  return result;
};

module.exports = {
  fanRegister,
  fanViewMatchesWithAvailableTicketsStartingGivenDate,
  fanPurchaseTicket,
  fanNationalIdFinder,
};
