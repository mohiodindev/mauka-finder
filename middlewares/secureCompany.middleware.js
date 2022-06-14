module.exports.companyIsAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(req.isAuthenticated());
    next();
  } else {
    res.redirect("/company-login");
  }
};

module.exports.companyIsNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/company-profile");
    next();
  } else {
    next();
  }
};

module.exports.checkRole = (role) => (req, res, next) => {
  console.log("checkRole secureCompany middleware called");
  console.log("req.currentCompany: ", req.currentCompany);
  if (req.companyIsAuthenticated && req.user.role /* o req.user ?*/ === role) {
    next();
  } else {
    next();
  }
};
