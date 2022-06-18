module.exports.candidateIsAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/candidate-login");
  }
};

module.exports.candidateIsNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/candidate-profile");
    next();
  } else {
    next();
  }
};

module.exports.checkRole = (role) => (req, res, next) => {
  console.log("checkRole secureCandidate middleware called");
  console.log("req.currentCandidate: ", req.currentCandidate);
  if (
    req.isAuthenticated() &&
    req.currentCandidate.role /* o req.user ?*/ === role
  ) {
    console.log("if next");
    next();
  } else {
    console.log("else next");
    next();
  }
};
