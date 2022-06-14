const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const Company = require("../models/company.model");
const Candidate = require("../models/candidate.model");
const Offer = require("../models/offer.model");
const { sendCompanyActivationEmail } = require("../config/mailer.config");
const { sendDeleteCompanyEmail } = require("../config/mailer.config");
const { sendCompanyEmailUpdateEmail } = require("../config/mailer.config");
const { sendCompanyPasswordUpdateEmail } = require("../config/mailer.config");
const { v4: uuidv4 } = require("uuid");
const Application = require("../models/application.model");

module.exports.companyProfile = (req, res, next) => {
  Offer.find({ offers_publishedByCompany: req.currentCompany.id }).then(
    (offers) => {
      res.render("companies/companyProfile", { offers });
    }
  );
  // console.log('req.user company', req.user)
};

module.exports.login = (req, res, next) => {
  // console.log('req.user login controller', req.user)
  res.render("companies/login");
};

module.exports.doLogin = (req, res, next) => {
  passport.authenticate(
    "local-auth-companies",
    (error, company, validations) => {
      if (error) {
        next(error);
      } else if (!company) {
        res.status(400).render("companies/login", {
          company: req.body,
          errors: validations.error,
        });
      } else if (!company.active) {
        req.flash(
          "flashMessage",
          "Your account has not been verified yet. Please go to your email to activate it"
        );

        res.redirect("/company-login");
      } else {
        req.login(company, (loginErr) => {
          if (loginErr) {
            next(loginErr);
          } else {
            res.redirect("/company-profile");
          }
        });
      }
    }
  )(req, res, next);
};

module.exports.doLoginGoogle = (req, res, next) => {
  passport.authenticate(
    "google-auth-companies",
    (error, company, validations) => {
      if (error) {
        next(error);
      } else if (!company) {
        res.status(400).render("companies/login", {
          company: req.body,
          errors: validations.error,
        });
      } else {
        req.login(company, (loginErr) => {
          if (!loginErr) {
            res.redirect("/company-profile");
          } else {
            next(loginErr);
          }
        });
      }
    }
  )(req, res, next);
};

module.exports.signup = (req, res, next) => res.render("companies/signup");

module.exports.doSignup = (req, res, next) => {
  console.log("req.body signup", req.body);

  function renderWithErrors(errors) {
    console.log(errors);
    res.status(400).render("companies/signup", {
      errors: errors,
      company: req.body,
    });
    console.log("req.body signup", req.body);
  }

  Company.findOne({ email: req.body.email })
    .then((company) => {
      if (company) {
        renderWithErrors({
          email: "There is already a user with this email",
        });
      } else {
        Company.create(req.body)
          .then((createdCompany) => {
            req.flash(
              "flashMessage",
              "Profile created successfully! - Please, go to your email to finish the registration"
            );
            sendCompanyActivationEmail(
              createdCompany.email,
              createdCompany.token
            );
            res.redirect("/company-login");
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
  Company.findOneAndUpdate(
    { token: req.params.token, active: false },
    { active: true, token: uuidv4() }
  )
    .then((company) => {
      if (company) {
        //company.generateToken();
        req.flash(
          "flashMessage",
          "Your account has been activated - You can now Login!"
        );
        res.redirect("/company-login");
      } else {
        req.flash(
          "flashMessage",
          "Error activating your account, please try again."
        );
        res.redirect("/company-signup");
      }
    })
    .catch((err) => next(err));
};

module.exports.logout = (req, res, next) => {
  req.logout();
  res.redirect("/");
};

module.exports.edit = (req, res, next) => {
  Company.findById(req.params.id)
    .then((companyToEdit) => res.render("companies/signup", companyToEdit))
    .catch((err) => console.error(err));
};

module.exports.doEdit = (req, res, next) => {
  if (req.file) {
    req.body.picture = req.file.path;
  }

  Company.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(() => {
      res.redirect("/company-profile");
    })
    .catch((err) => next(err));
};

module.exports.updateEmail = (req, res, next) => {
  Company.findById({ _id: req.currentCompany.id })
    .then((companyToUpdate) => {
      //console.log('candidateToDelete', candidateToDelete)
      req.flash(
        "flashMessage",
        "Email update request successful - Please go to your email to confirm the change"
      );
      sendCompanyEmailUpdateEmail(companyToUpdate.email, companyToUpdate.token);
      res.redirect("/company-profile");
    })
    .catch((err) => next(err));
};

module.exports.editEmail = (req, res, next) =>
  res.render("companies/newEmailForm");

module.exports.doEditEmail = (req, res, next) => {
  function renderWithErrors(errors) {
    res.status(400).render("companies/newEmailForm", {
      errors: errors,
      company: req.body,
    });
  }

  if (req.body.newEmail != req.body.confirmEmail) {
    renderWithErrors({
      confirmEmail: "The emails do not match.",
    });
  } else if (req.body.newEmail == "" || req.body.confirmEmail == "") {
    renderWithErrors({
      email: "The fields must not be empty.",
    });
  } else if (req.body.newEmail == req.currentCompany.email) {
    renderWithErrors({
      email: "Email ALready Used",
    });
    // if email used by candidate
    const candidate = Candidate.findOne({ email: req.body.newEmail });
    console.log("candidate", candidate);
  } else if (req.body.newEmail == candidate.email) {
    renderWithErrors({
      email: "Email ALready Used",
    });
  } else {
    Company.findOneAndUpdate(
      {
        _id: req.currentCompany.id,
      },
      {
        email: req.body.newEmail,
        token: uuidv4(),
      }
    )
      .then(() => {
        req.flash("flashMessage", "Your email has been successfully updated!");
        res.redirect("/company-profile");
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
  Company.findById({ _id: req.currentCompany.id })
    .then((companyToUpdate) => {
      req.flash(
        "flashMessage",
        "Password update request successful - Please go to your email to confirm the change"
      );
      sendCompanyPasswordUpdateEmail(
        companyToUpdate.email,
        companyToUpdate.token
      );
      res.redirect("/company-profile");
    })
    .catch((err) => next(err));
};

module.exports.editPassword = (req, res, next) =>
  res.render("companies/newPasswordForm");

module.exports.doEditPassword = (req, res, next) => {
  function renderWithErrors(errors) {
    res.status(400).render("companies/newPasswordForm", {
      errors: errors,
      company: req.body,
    });
  }

  Company.findById(req.currentCompany.id)
    .then((company) => {
      return company
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
              company.password = req.body.newPassword;
              company.token = uuidv4();
              return company
                .save()
                .then(() => {
                  req.flash(
                    "flashMessage",
                    "Your password has been successfully updated!"
                  );
                  res.redirect("/company-profile");
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
  Company.findById({ _id: req.currentCompany.id })
    .then((companyToDelete) => {
      req.flash(
        "flashMessage",
        "Unsubscription request made correctly - Please, go to your email to finish the process"
      );
      sendDeleteCompanyEmail(companyToDelete.email, companyToDelete.token);
      res.redirect("/");
    })
    .catch((err) => next(err));
};

module.exports.doDelete = (req, res, next) => {
  Company.findOne({ token: req.params.token })
    .then((company) => {
      console.log("company 1st then", company);
      Offer.find({ offers_publishedByCompany: company.id })
        .then((offers) => {
          console.log("offers", offers);
          offers.forEach((offer) => {
            offer.active = false;
            offer.save();
          });

          Company.findByIdAndDelete(company.id).then(() => {
            req.flash("flashMessage", "Company removed successfully!");
            res.redirect("/");
          });
        })
        .catch((e) => next(e));
    })
    .catch((e) => next(e));
};
