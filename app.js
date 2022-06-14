require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const routes = require("./config/routes");
const createError = require("http-errors");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("./config/session.config");
const Candidate = require("./models/candidate.model");
const Company = require("./models/company.model");

require("./config/db.config");
require("./config/passport.config");
require("./config/hbs.config");

// Express config
const app = express();
//app.use(express.json());
app.use((req, res, next) => {
  if (req.originalUrl === "/offers/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});
app.use((req, res, next) => {
  if (req.originalUrl === "/offers/webhook") {
    next();
  } else {
    express.urlencoded({ extended: false })(req, res, next);
  }
});
app.use(express.static("public"));
app.use(logger("dev"));
app.use(session);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

// SESSION CONFIG
app.use((req, res, next) => {
  if (req.session.currentCandidateId) {
    Candidate.findById(req.session.currentCandidateId).then((candidate) => {
      if (candidate) {
        req.currentCandidate = candidate;
        res.locals.currentCandidate = candidate;
        next();
      } else {
        next();
      }
    });
  } else {
    next();
  }
});

app.use((req, res, next) => {
  if (req.session.currentCompanyId) {
    Company.findById(req.session.currentCompanyId).then((company) => {
      if (company) {
        req.currentCompany = company;
        res.locals.currentCompany = company;
        next();
      } else {
        next();
      }
    });
  } else {
    next();
  }
});

//PASSPORT
app.use((req, res, next) => {
  //console.log('app.js', req.user)
  if (req.user) {
    if (req.user.surname) {
      req.currentCandidate = req.user;
      //console.log('req.currentCandidate', req.currentCandidate)
      res.locals.currentCandidate = req.user;
      //console.log('res.locals', res.locals.currentCandidate)
      next();
    } else {
      req.currentCompany = req.user;
      res.locals.currentCompany = req.user;
      next();
    }
  } else {
    next();
  }
});

app.use((req, res, next) => {
  //FLASH
  res.locals.flashMessage = req.flash("flashMessage");

  //GOOGLE MAPS
  res.locals.mapsKey = process.env.MAPS_KEY;

  next();
});

app.use("/", routes);

// Error handler
app.use((req, res, next) => {
  next(createError(404));
});

app.use((error, req, res, next) => {
  console.log(error);
  if (!error.status) {
    error = createError(500);
  }
  res.status(error.status);
  res.render("error", error);
});

// Initialization on port
app.listen(3000, () => console.log(`listening on port ${3000}`));
