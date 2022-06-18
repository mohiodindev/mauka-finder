const mongoose = require("mongoose");
const Offer = require("../models/offer.model");
const Candidate = require("../models/candidate.model");
const Application = require("../models/application.model");
const flash = require("connect-flash");

module.exports.detail = (req, res, next) => {
  const offer = req.params.id;
  //console.log('idOffer', offer)
  Offer.findOne({
    $and: [
      { _id: req.params.id },
      { offers_publishedByCompany: req.currentCompany.id },
    ],
  })
    .then((offer) => {
      if (offer) {
        Application.find({ offer: offer._id })
          .populate("candidate")
          .then((application) => {
            res.render("application/application-detail", {
              offer,
              application,
            });
          })
          .catch((err) => next(err));
      } else {
        res.render("denied-route");
      }
    })
    .catch((err) => next(err));
};

module.exports.apply = (req, res, next) => {
  const offer = req.params.id;
  const candidate = req.currentCandidate.id;

  Application.findOne({
    $and: [
      {
        offer: offer,
      },
      {
        candidate: candidate,
      },
    ],
  })
    .then((application) => {
      if (application) {
        req.flash("flashMessage", "You are already enrolled in this offer!");
        res.redirect("/candidate-profile");
      } else {
        // if (!application) {
        Application.create({ candidate: candidate, offer: offer })
          .then((createdApplication) => {
            res.redirect("/candidate-profile");
          })
          .catch((err) => next(err));
      }
    })
    .catch((err) => next(err));
};

module.exports.search = (req, res, next) => {
  if (req.query.age) {
    Application.find({ offer: req.query.offerId })
      .populate("offer")
      .then((applications) => {
        console.log(applications);
        Candidate.find({ age: req.query.age }).then((Candidates) => {
          res.render("application/application-detail", {
            Candidates,
            offer: applications[0].offer,
          });
        });
      })
      .catch((e) => next(e));
  } else if (req.query.address) {
    Application.find({ offer: req.query.offerId })
      .populate("offer")
      .then((applications) => {
        console.log("applications", applications);
        Candidate.find()
          .then((CandidatesFound) => {
            const queryAddress = req.query.address.toLowerCase().slice(1);
            let filteredCandidates = [];
            CandidatesFound.forEach((c) => {
              const cityCandidate = c.address;
              if (cityCandidate.includes(queryAddress)) {
                filteredCandidates.push(c);
              }
            });
            return filteredCandidates;
          })
          .then((Candidates) => {
            res.render("application/application-detail", {
              Candidates,
              offer: applications[0].offer,
            });
          })
          .catch((e) => next(e));
      })
      .catch((e) => next(e));
  } else {
    console.log("else");
    next();
  }
};
