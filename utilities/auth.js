const { StatusCodes } = require("http-status-codes");

const ROLE = {
  SYSTEM_ADMIN: "0",
  FAN: "1",
  STADIUM_MANAGER: "2",
  CLUB_REPRESENTATIVE: "3",
  SPORTS_ASSOCIATION_MANAGER: "4",
};

const authUser = function (req, res, next) {
  if (req.session.type) {
    next();
  } else {
    res.status(StatusCodes.UNAUTHORIZED);
    res.redirect("/");
  }
};

const authRole = function (roles) {
  return (req, res, next) => {
    if (roles.includes(req.session.type)) {
      next();
    } else {
      res.status(StatusCodes.UNAUTHORIZED).render("error", {
        title: "401 UNAUTHORIZED",
        message: "Error 401 : UNAUTHORIZED",
      });
    }
  };
};

module.exports = { authUser, authRole, ROLE };
