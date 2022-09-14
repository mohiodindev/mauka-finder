const passport = require("passport");
const mongoose = require("mongoose");

const Company = require("../models/company.model");
const Candidate = require("../models/candidate.model");

const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const { json } = require("express");
passport.serializeUser((entity, next) => {
  next(null, entity);
});

passport.deserializeUser((entity, next) => {
  if (entity.surname) {
    Candidate.findById(entity.id)
      .then((candidate) => next(null, candidate))
      .catch(next);
  } else {
    Company.findById(entity.id)
      .then((company) => {
        next(null, company);
      })
      .catch(next);
  }
});

//LOCAL
passport.use(
  "local-auth-companies",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, next) => {
      Company.findOne({
        email: email,
      })
        .then((company) => {
          if (!company) {
            next(null, false, {
              error: "The email or password is not correct",
            });
          } else {
            return company.checkPassword(password).then((match) => {
              if (match) {
                //   if (company.active) {
                console.log("Company", company);
                next(null, company);
              } else {
                next(null, false, {
                  error: "The email or password is not correct",
                });
              }
            });
          }
        })
        .catch(next);
    }
  )
);

passport.use(
  "local-auth-Candidates",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, next) => {
      console.log(email, password);
      Candidate.findOne({
        email: email,
      })
        .then((candidate) => {
          if (!candidate) {
            next(null, false, {
              error: "The email or password is not correct",
            });
            console.log(candidate);
          } else {
            return candidate.checkPassword(password).then((match) => {
              if (!match) {
                next(null, false, {
                  error: "The email or password is not correct",
                });
              } else {
                next(null, candidate);
              }
            });
          }
        })
        .catch(next);
    }
  )
);

// //GOOGLE - COMPANIES
passport.use(
  "google-auth-companies",
  new GoogleStrategy(
    {
      clientID:
        process.env.GCO_CLIENT_ID ||
        "773585323215-l66re452joh4jnuuhep1otck9k6b4pfj.apps.googleusercontent.com",
      clientSecret: process.env.GCO_CLIENT_SECRET,
      callbackURL:
        process.env.GCO_REDIRECT_URI_COMPANIES ||
        "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, next) => {
      const googleID = profile.id;
      const email = profile.emails[0] ? profile.emails[0].value : undefined;

      if (googleID && email) {
        Company.findOne({
          $or: [
            {
              email: email,
            },
            {
              "social.google": googleID,
            },
          ],
        })
          .then((company) => {
            if (!company) {
              const newCompanyInstance = new Company({
                name: profile.name.givenName,
                email: email,
                social: {
                  google: googleID,
                },
                //active: true,
                password: "Aa1" + mongoose.Types.ObjectId(),
              });
              return newCompanyInstance.save().then((newCompany) => {
                next(null, newCompany);
              });
            } else {
              next(null, company);
            }
          })
          .catch(next);
      } else {
        next(null, false, {
          errors: "Oauth provider error",
        });
      }
    }
  )
);

//GOOGLE - Candidates
passport.use(
  "google-auth-Candidates",
  new GoogleStrategy(
    {
      clientID:
        process.env.GCA_CLIENT_ID ||
        "773585323215-l66re452joh4jnuuhep1otck9k6b4pfj.apps.googleusercontent.com",
      clientSecret: process.env.GCA_CLIENT_SECRET,
      callbackURL:
        process.env.GCO_REDIRECT_URI_CANDIDATES ||
        "http://localhost:3000/auth/google/callback/candidate",
    },
    (accessToken, refreshToken, profile, next) => {
      const googleID = profile.id;
      const email = profile.emails[0] ? profile.emails[0].value : undefined;

      if (googleID && email) {
        Candidate.findOne({
          $or: [
            {
              email: email,
            },
            {
              "social.google": googleID,
            },
          ],
        })
          .then((candidate) => {
            if (!candidate) {
              const newCandidateInstance = new Candidate({
                name: profile.name.givenName,
                surname: profile.name.familyName,
                picture: profile.photos[0].value,
                email: email,
                social: {
                  google: googleID,
                },
                //active: true,
                password: "Aa1" + mongoose.Types.ObjectId(),
              });
              return newCandidateInstance.save().then((newCandidate) => {
                next(null, newCandidate);
              });
            } else {
              next(null, candidate);
            }
          })
          .catch(next);
      } else {
        next(null, false, {
          errors: "Oauth provider error",
        });
      }
    }
  )
);
