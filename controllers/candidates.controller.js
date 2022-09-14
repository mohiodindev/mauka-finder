const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const Candidate = require("../models/candidate.model");
const Offer = require("../models/offer.model");
const Application = require("../models/application.model");
const { sendCandidateActivationEmail } = require("../config/mailer.config");
const { sendDeleteCandidateEmail } = require("../config/mailer.config");
const { sendCandidateEmailUpdateEmail } = require("../config/mailer.config");
const { sendCandidatePasswordUpdateEmail } = require("../config/mailer.config");
const { v4: uuidv4 } = require("uuid");

module.exports.candidateProfile = (req, res, next) => {
  Application.find({ candidate: req.currentCandidate.id })
    .populate("offer")
    .then((application) => {
      res.render("Candidates/candidateProfile", {
        application,
      });
    });
};

module.exports.login = (req, res, next) => res.render("Candidates/login");

module.exports.doLogin = (req, res, next) => {
  passport.authenticate(
    "local-auth-Candidates",
    (error, candidate, validations) => {
      if (error) {
        next(error);
      } else if (!candidate) {
        res.status(400).render("Candidates/login", {
          candidate: req.body,
          error: validations.error,
        });
      } else if (!candidate.active) {
        req.flash(
          "flashMessage",
          "Your account has not been verified yet. Please go to your email to activate it"
        );
        res.redirect("/candidate-login");
      } else {
        req.login(candidate, (loginErr) => {
          if (!loginErr && !candidate.age) {
            req.flash(
              "flashMessage",
              "You must finish completing your profile"
            );
            res.redirect(`/candidate-edit/${candidate._id}`);
          } else if (candidate.age) {
            res.redirect(`/candidate-profile`);
          } else {
            next(loginErr);
          }
        });
      }
    }
  )(req, res, next);
};

module.exports.doLoginGoogle = (req, res, next) => {
  passport.authenticate(
    "google-auth-Candidates",
    (error, candidate, validations) => {
      if (error) {
        next(error);
      } else if (!candidate) {
        res.status(400).render("Candidates/login", {
          candidate: req.body,
          errors: validations.error,
        });
      } else {
        req.login(candidate, (loginErr) => {
          if (!loginErr && !candidate.age) {
            req.flash(
              "flashMessage",
              "You must finish completing your profile"
            );
            res.redirect(`/candidate-edit/${candidate._id}`);
          } else if (!loginErr && candidate.age) {
            res.redirect(`/candidate-profile`);
          } else {
            next(loginErr);
          }
        });
      }
    }
  )(req, res, next);
};

module.exports.signup = (req, res, next) => res.render("Candidates/signup");

module.exports.doSignup = (req, res, next) => {
  function renderWithErrors(errors) {
    res.status(400).render("Candidates/signup", {
      errors: errors,
      candidate: req.body,
    });
  }
  Candidate.findOne({
    email: req.body.email,
  })
    .then((candidate) => {
      if (candidate) {
        renderWithErrors({
          email: "There is already a user with this email",
        });
      } else {
        Candidate.create(req.body)
          .then((createdCandidate) => {
            req.flash(
              "flashMessage",
              "Profile created successfully! - Please, go to your email to finish the registration"
            );
            sendCandidateActivationEmail(
              createdCandidate.email,
              createdCandidate.token
            );
            res.redirect("/candidate-login");
          })
          .catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
              renderWithErrors(err.errors);
            } else {
              next(err);
            }
          });
      }
    })
    .catch((err) => next(err));
};

module.exports.activate = (req, res, next) => {
  Candidate.findOneAndUpdate(
    {
      token: req.params.token,
      active: false,
    },
    {
      active: true,
      token: uuidv4(),
    }
  )
    .then((candidate) => {
      if (candidate) {
        req.flash(
          "flashMessage",
          "Your account has been activated - You can now Login!"
        );
        res.redirect("/candidate-login");
      } else {
        req.flash(
          "flashMessage",
          "Error activating your account, please try again."
        );
        res.redirect("/candidate-signup");
      }
    })
    .catch((err) => next(err));
};

module.exports.logout = (req, res, next) => {
  req.logout();
  res.redirect("/");
};

module.exports.edit = (req, res, next) => {
  const candidate = req.body;

  if (candidate.skills) {
    candiate.skills = candidate.skills.split(",");
  }

  Candidate.findById({
    _id: req.currentCandidate.id,
  })
    .then((candidateToEdit) => res.render("Candidates/signup", candidateToEdit))
    .catch((err) => next(err));
};

module.exports.doEdit = (req, res, next) => {
  if (req.files.picture) {
    req.body.picture = req.files.picture[0].path;
  }

  if (req.files.cv) {
    req.body.cv = req.files.cv[0].path + ".jpg";
  }

  Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(() => res.redirect("/candidate-profile"))
    .catch((err) => next(err));
};

module.exports.updateEmail = (req, res, next) => {
  Candidate.findById({ _id: req.currentCandidate.id })
    .then((candidateToUpdate) => {
      req.flash(
        "flashMessage",
        "Email update request successful - Please go to your email to confirm the change"
      );
      sendCandidateEmailUpdateEmail(
        candidateToUpdate.email,
        candidateToUpdate.token
      );
      res.redirect("/candidate-profile");
    })
    .catch((err) => next(err));
};

module.exports.editEmail = (req, res, next) =>
  res.render("Candidates/newEmailForm");

module.exports.doEditEmail = (req, res, next) => {
  function renderWithErrors(errors) {
    res.status(400).render("Candidates/newEmailForm", {
      errors: errors,
      candidate: req.body,
    });
  }

  if (req.body.newEmail != req.body.confirmEmail) {
    console.log("¡Los emails no coinciden!");
    renderWithErrors({
      confirmEmail: "The emails do not match.",
    });
  } else if (req.body.newEmail == "" || req.body.confirmEmail == "") {
    renderWithErrors({
      email: "The fields must not be empty.",
    });
  } else if (req.body.newEmail == req.currentCandidate.email) {
    console.log("¡Error, por favor intentalo de nuevo!");
    renderWithErrors({
      email: "Email ALready Used",
    });
  } else {
    Candidate.findOneAndUpdate(
      {
        _id: req.currentCandidate.id,
      },
      {
        email: req.body.newEmail,
        token: uuidv4(),
      }
    )
      .then(() => {
        req.flash("flashMessage", "Your email has been successfully updated!");
        res.redirect("/candidate-profile");
      })
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          renderWithErrors();
        } else {
          next(err);
        }
      });
  }
};

module.exports.updatePassword = (req, res, next) => {
  Candidate.findById({
    _id: req.currentCandidate.id,
  })
    .then((candidateToUpdate) => {
      req.flash(
        "flashMessage",
        "Password update request successful - Please go to your email to confirm the change"
      );
      sendCandidatePasswordUpdateEmail(
        candidateToUpdate.email,
        candidateToUpdate.token
      );
      res.redirect("/candidate-profile");
    })
    .catch((err) => next(err));
};

module.exports.editPassword = (req, res, next) => {
  Candidate.findOne({
    token: req.params.token,
  })
    .then((candidate) => {
      res.render("Candidates/newPasswordForm", {
        candidate,
      });
    })
    .catch((err) => next(err));
};

module.exports.doEditPassword = (req, res, next) => {
  function renderWithErrors(errors) {
    res.status(400).render("Candidates/newPasswordForm", {
      errors: errors,
      candidate: req.body,
    });
  }

  Candidate.findById(req.currentCandidate.id)
    .then((candidate) => {
      console.log("candidate", candidate);
      return candidate
        .checkPassword(req.body.newPassword)
        .then((match) => {
          if (!match) {
            if (req.body.newPassword !== req.body.confirmPassword) {
              renderWithErrors({
                confirmPassword: "Passwords do not match.",
              });
            } else if (
              req.body.newPassword == "" ||
              req.body.confirmPassword == ""
            ) {
              renderWithErrors({
                password: "The fields must not be empty.",
              });
            } else {
              console.log("candidate pw !match else");
              candidate.password = req.body.newPassword;
              candidate.token = uuidv4();
              return candidate
                .save()
                .then(() => {
                  req.flash(
                    "flashMessage",
                    "Your password has been successfully updated!"
                  );
                  res.redirect("/candidate-profile");
                })
                .catch((err) => next(err));
            }
          } else {
            renderWithErrors({
              password: "That password has already been used",
            });
          }
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.ValidationError) {
            renderWithErrors(err.errors);
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        renderWithErrors(err.errors); // Not rendering errors
      } else {
        next(err);
      }
    });
};

module.exports.delete = (req, res, next) => {
  Candidate.findById({
    _id: req.currentCandidate.id,
  })
    .then((candidateToDelete) => {
      req.flash(
        "flashMessage",
        "Unsubscription request made correctly - Please, go to your email to finish the process"
      );
      sendDeleteCandidateEmail(
        candidateToDelete.email,
        candidateToDelete.token
      );
      res.redirect("/");
    })
    .catch((err) => next(err));
};

module.exports.doDelete = (req, res, next) => {
  Candidate.findOne({ token: req.params.token })
    .then((candidate) => {
      console.log("candidate", candidate);
      Application.deleteMany({ candidate: candidate.id })
        .then(() => {
          console.log("application deleted");
          Candidate.findByIdAndDelete(candidate.id).then(() => {
            req.flash("flashMessage", "Successfully removed candidate!");
            res.redirect("/");
          });
        })
        .catch((e) => next(e));
    })
    .catch((e) => next(e));
};
