const sql = require("mssql");

const adminAddNewClub = async (name, c_location) => {
  const request = new sql.Request();
  request.input("name", sql.VarChar, name);
  request.input("c_location", sql.VarChar, c_location);
  //   should we have a success output?
  const result = await request.execute("AdminAddNewClub");
  return result;
};

const adminDeleteClub = async (name) => {
  const request = new sql.Request();
  request.input("name", sql.VarChar, name);
  const result = await request.execute("AdminDeleteClub");
  return result;
};

const adminAddNewStadium = async (name, location, capacity) => {
  const request = new sql.Request();
  request.input("name", sql.VarChar, name);
  request.input("location", sql.VarChar, location);
  request.input("capacity", sql.Int, capacity);
  const result = await request.execute("AdminAddNewStadium");
  return result;
};

const adminDeleteStadium = async (name) => {
  const request = new sql.Request();
  request.input("name", sql.VarChar, name);
  const result = await request.execute("AdminDeleteStadium");
  return result;
};

const adminBlockFan = async (national_id) => {
  const request = new sql.Request();
  request.input("national_id", sql.VarChar, national_id);
  const result = await request.execute("AdminBlockFan");
  return result;
};

module.exports = {
  adminAddNewClub,
  adminDeleteClub,
  adminAddNewStadium,
  adminDeleteStadium,
  adminBlockFan,
};
