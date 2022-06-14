const passport = require("passport");
const mongoose = require("mongoose");

const Company = require("../models/company.model");
const Candidate = require("../models/candidate.model");

const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const { json } = require("express");
//const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

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
              error: "El correo electrónico o la contraseña no son correctos",
            });
          } else {
            return company.checkPassword(password).then((match) => {
              if (match) {
                //   if (company.active) {
                console.log("Company", company);
                next(null, company); // Ya incluye todos los datos después del doble populate
                //   } else {
                //     next(null, false, { error: "Tu cuenta no está activa, mira tu email" })
                //   }
              } else {
                next(null, false, {
                  error:
                    "El correo electrónico o la contraseña no son correctos",
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
      Candidate.findOne({
        email: email,
      })
        .then((candidate) => {
          if (!candidate) {
            next(null, false, {
              error: "El correo electrónico o la contraseña no son correctos",
            });
          } else {
            return candidate.checkPassword(password).then((match) => {
              if (match) {
                //   if (candidate.active) {
                console.log("Candidate", candidate);
                next(null, candidate);
                //   } else {
                //     next(null, false, { error: "Tu cuenta no está activa, mira tu email" })
                //   }
              } else {
                next(null, false, {
                  error:
                    "El correo electrónico o la contraseña no son correctos",
                });
              }
            });
          }
        })
        .catch(next);
    }
  )
);

// //GOOGLE - COMPANIES
// passport.use('google-auth-companies', new GoogleStrategy({
//     clientID: process.env.GCO_CLIENT_ID,
//     clientSecret: process.env.GCO_CLIENT_SECRET,
//     callbackURL: process.env.GCO_REDIRECT_URI_COMPANIES,
// }, (accessToken, refreshToken, profile, next) => {
//     const googleID = profile.id
//     const email = profile.emails[0] ? profile.emails[0].value : undefined

//     if (googleID && email) {
//         Company.findOne({
//             $or: [{
//                     email: email
//                 },
//                 {
//                     'social.google': googleID
//                 }
//             ]
//         }).then(company => {
//             if (!company) {
//                 const newCompanyInstance = new Company({
//                     name: profile.name.givenName,
//                     email: email,
//                     social: {
//                         google: googleID
//                     },
//                     //active: true,
//                     password: 'Aa1' + mongoose.Types.ObjectId()
//                 })
//                 return newCompanyInstance.save()
//                     .then(newCompany => {
//                         next(null, newCompany)
//                     })
//             } else {
//                 next(null, company)
//             }
//         }).catch(next)
//     } else {
//         next(null, false, {
//             errors: "Error con el proveedor Oauth"
//         })
//     }

// }))

// //GOOGLE - Candidates
// passport.use('google-auth-Candidates', new GoogleStrategy({
//     clientID: process.env.GCA_CLIENT_ID,
//     clientSecret: process.env.GCA_CLIENT_SECRET,
//     callbackURL: process.env.GCO_REDIRECT_URI_Candidates,
// }, (accessToken, refreshToken, profile, next) => {
//     const googleID = profile.id
//     const email = profile.emails[0] ? profile.emails[0].value : undefined

//     if (googleID && email) {
//         Candidate.findOne({
//             $or: [{
//                     email: email
//                 },
//                 {
//                     'social.google': googleID
//                 }
//             ]
//         }).then(candidate => {
//             if (!candidate) {
//                 const newCandidateInstance = new Candidate({
//                     name: profile.name.givenName,
//                     surname: profile.name.familyName,
//                     picture: profile.photos[0].value,
//                     email: email,
//                     social: {
//                         google: googleID
//                     },
//                     //active: true,
//                     password: 'Aa1' + mongoose.Types.ObjectId()
//                 })
//                 return newCandidateInstance.save()
//                     .then(newCandidate => {
//                         next(null, newCandidate)
//                     })
//             } else {
//                 next(null, candidate)
//             }
//         }).catch(next)
//     } else {
//         next(null, false, {
//             errors: "Error con el proveedor Oauth"
//         })
//     }

// }))

//LINKEDIN
// passport.use('linkedin-auth-Candidates', new LinkedInStrategy({
//     clientID: process.env.L_CLIENT_ID,
//     clientSecret: process.env.L_CLIENT_SECRET,
//     callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback",
//     scope: ['r_emailaddress', 'r_liteprofile'],
//     passReqToCallback: true
// }, (accessToken, refreshToken, profile, next) => {
//         const linkedinID = profile.id
//         const email = profile.emails[0] ? profile.emails[0].value : undefined

//         if (linkedinID && email) {
//             Candidate.findOne({
//                 $or: [
//                     { email: email },
//                     {'social.linkedin': linkedinID}
//                 ]
//             }).then(candidate => {
//                 if (!candidate) {
//                     const newCandidateInstance = new Candidate({
//                         name: email,
//                         surname: email,
//                         email: email,
//                         social: {
//                             linkedin: linkedinID
//                         },
//                         tokens: accessToken,
//                         //active: true,
//                         password: 'Aa1' + mongoose.Types.ObjectId()
//                     })
//                     return newCandidateInstance.save()
//                         .then(newCandidate => {
//                             next(null, newCandidate)
//                         })
//                 } else {
//                     next(null, candidate)
//                 }
//             }).catch(next)
//         } else {
//             next(null, false, {errors: "Error con el proveedor Oauth"})
//         }
// }))
