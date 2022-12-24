const sql = require("mssql");

const userLogin = async (username, password) => {
  const request = new sql.Request();
  request.input("username", sql.VarChar, username);
  request.input("password", sql.VarChar, password);
  const result = await request.execute("Login");
  return result;
};

const userType = async (username) => {
  const request = new sql.Request();
  request.input("username", sql.VarChar, username);
  request.output("type", sql.Int);
  const result = await request.execute("TypeOfUser");
  return result;
};

module.exports = {
  userLogin,
  userType,
};
