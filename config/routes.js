const router = require("express").Router();
const passport = require("passport");
const miscController = require("../controllers/misc.controller");
const CandidatesController = require("../controllers/Candidates.controller");
const companiesController = require("../controllers/companies.controller");
const offersController = require("../controllers/offers.controller");
const applicationController = require("../controllers/application.controller");
const secure = require("../middlewares/secure.middleware");
// const paginate = require('../middlewares/paginate.middleware');
const multer = require("multer");
const upload = require("./storage.config");
const Offer = require("../models/offer.model");
const Candidate = require("../models/candidate.model");
const express = require("express");

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

// MISC
router.get("/", miscController.home);
router.get("/main-login", miscController.mainLogin);
router.get("/search", miscController.search);

// Candidates
router.get(
  "/candidate-profile",
  secure.checkRole("CANDIDATE"),
  CandidatesController.candidateProfile
);

router.get("/candidate-signup", CandidatesController.signup);
router.post("/candidate-signup", CandidatesController.doSignup);
router.get("/activate-candidate/:token", CandidatesController.activate);

router.get("/candidate-login", CandidatesController.login);
router.post("/candidate-login", CandidatesController.doLogin);
router.get(
  "/authenticate/google",
  passport.authenticate("google-auth-Candidates", {
    scope: GOOGLE_SCOPES,
  })
);
router.get("/authenticate/google/callback", CandidatesController.doLoginGoogle);
router.post(
  "/candidate-logout",
  secure.checkRole("CANDIDATE"),
  CandidatesController.logout
);

router.get(
  "/candidate-edit/:id",
  secure.checkRole("CANDIDATE"),
  CandidatesController.edit
);
router.post(
  "/candidate-edit/:id",
  secure.checkRole("CANDIDATE"),
  upload.fields([
    { name: "picture", maxCount: 1 },
    { name: "cv", maxCount: 1 },
  ]),
  CandidatesController.doEdit
);
router.post(
  "/candidate-update-email",
  secure.checkRole("CANDIDATE"),
  CandidatesController.updateEmail
);
router.post(
  "/candidate-edit-email",
  secure.checkRole("CANDIDATE"),
  CandidatesController.doEditEmail
);
router.get(
  "/candidate-edit-email/:token",
  secure.checkRole("CANDIDATE"),
  CandidatesController.editEmail
);
router.post(
  "/candidate-update-password/",
  secure.checkRole("CANDIDATE"),
  CandidatesController.updatePassword
);
router.get(
  "/candidate-edit-password/:token",
  secure.checkRole("CANDIDATE"),
  CandidatesController.editPassword
);
router.post(
  "/candidate-edit-password",
  secure.checkRole("CANDIDATE"),
  CandidatesController.doEditPassword
);

router.post(
  "/delete-candidate",
  secure.checkRole("CANDIDATE"),
  CandidatesController.delete
);
router.get("/delete-candidate/:token", CandidatesController.doDelete);

// COMPANIES
router.get(
  "/company-profile",
  secure.checkRole("COMPANY"),
  companiesController.companyProfile
);

router.get("/company-signup", companiesController.signup);
router.post("/company-signup", companiesController.doSignup);
router.get("/activate-company/:token", companiesController.activate);

router.get("/company-login", companiesController.login);
router.post("/company-login", companiesController.doLogin);
router.get(
  "/auth/google",
  passport.authenticate("google-auth-companies", {
    scope: GOOGLE_SCOPES,
  })
);
router.get("/auth/google/callback", companiesController.doLoginGoogle);
router.post(
  "/company-logout",
  secure.checkRole("COMPANY"),
  companiesController.logout
);

router.get(
  "/company-edit/:id",
  secure.checkRole("COMPANY"),
  companiesController.edit
);
router.post(
  "/company-edit/:id",
  secure.checkRole("COMPANY"),
  upload.single("picture"),
  companiesController.doEdit
); // REVISAR
router.post(
  "/company-update-email",
  secure.checkRole("COMPANY"),
  companiesController.updateEmail
);
router.post(
  "/company-edit-email",
  secure.checkRole("COMPANY"),
  companiesController.doEditEmail
);
router.get(
  "/company-edit-email/:token",
  secure.checkRole("COMPANY"),
  companiesController.editEmail
);
router.post(
  "/company-update-password/",
  secure.checkRole("COMPANY"),
  companiesController.updatePassword
);
router.post(
  "/company-edit-password",
  secure.checkRole("COMPANY"),
  companiesController.doEditPassword
);
router.get(
  "/company-edit-password/:token",
  secure.checkRole("COMPANY"),
  companiesController.editPassword
);

router.post(
  "/delete-company",
  secure.checkRole("COMPANY"),
  companiesController.delete
);
router.get("/delete-company/:token", companiesController.doDelete);

// OFFERS
router.get("/offers-list", offersController.offersList);
// router.get('/offers-filtered', paginate.results(Offer), offersController.offersFiltered);
router.get("/offer-detail/:id", offersController.offerDetail);
router.get(
  "/offer-creation",
  secure.checkRole("COMPANY"),
  offersController.create
);
router.post(
  "/offer-creation",
  secure.checkRole("COMPANY"),
  offersController.doCreate
);
router.get(
  "/edit-offer/:id",
  secure.checkRole("COMPANY"),
  offersController.edit
);
router.post(
  "/edit-offer/:id",
  secure.checkRole("COMPANY"),
  offersController.doEdit
);
router.post(
  "/delete-offer/:id",
  secure.checkRole("COMPANY"),
  offersController.delete
);
router.get(
  "/search-offers",
  /*paginate.results(Offer),*/ offersController.search
);
router.post(
  "/offers/:id/paid",
  secure.checkRole("COMPANY"),
  offersController.paid
);
router.post(
  "/offers/webhook",
  express.raw({ type: "application/json" }),
  offersController.webhook
);

// APPLICATION
router.get(
  "/application-detail/:id",
  secure.checkRole("COMPANY"),
  applicationController.detail
);
router.post(
  "/apply/:id",
  secure.checkRole("CANDIDATE"),
  applicationController.apply
);
router.get(
  "/application-search",
  secure.checkRole("COMPANY"),
  applicationController.search
);

module.exports = router;
