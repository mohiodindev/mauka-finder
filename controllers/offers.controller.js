const mongoose = require("mongoose");
const Offer = require("../models/offer.model");
const Application = require("../models/application.model");
const flash = require("connect-flash");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const createError = require("http-errors");

module.exports.offersList = (req, res, next) => {
  Offer.find({ $and: [{ active: true }, { paid: true }] })
    .sort("-createdAt")
    .populate("offers_publishedByCompany")
    .then((offers) => {
      res.render("offers/offersList", {
        offers,
      });
    })
    .catch((err) => next(err));
};

module.exports.offersFiltered = (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit) || 7;
  const startIndex = (page - 1) * limit;
  const query = req.query.search;

  Offer.find()
    .populate("offers_publishedByCompany")
    .sort("-createdAt")
    .limit(limit)
    .skip(startIndex)
    .then((offers) => res.send(offers))
    .catch((err) => next(err));
};

module.exports.offerDetail = (req, res, next) => {
  Offer.findById(req.params.id)
    .populate("offers_publishedByCompany")
    .then((offer) => {
      console.log("offerDetil", offer);
      res.render("offers/offerDetail", {
        offer,
        lat: offer.location.coordinates[1],
        lng: offer.location.coordinates[0],
      });
    });
};

module.exports.create = (req, res, next) => res.render("offers/offerCreation");

module.exports.doCreate = (req, res, next) => {
  function renderWithErrors(errors) {
    res.render("offers/offerCreation", {
      errors: errors,
      offer: req.body,
    });
  }

  req.body.location = {
    type: "Point",
    coordinates: [Number(req.body.lng), Number(req.body.lat)],
  };

  const offer = req.body;
  offer.offers_publishedByCompany = req.currentCompany.id;
  if (offer.skills) {
    offer.skills = offer.skills.split(",");
  }

  const company = req.currentCompany.id;

  Offer.create(offer)
    .then((createdOffer) => {
      console.log("created offer: ", createdOffer);
      res.redirect(`/offer-detail/${createdOffer.id}`);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        console.log("catch created offer", err);
        renderWithErrors(err.errors);
      } else {
        console.log("next created offer");
        next(err);
      }
    });
};

module.exports.paid = (req, res, next) => {
  Offer.findById(req.params.id)
    .then((offer) => {
      if (!offer) {
        next(createError(404));
      } else if (offer.paid) {
        next(createError(403));
      } else {
        return stripe.checkout.sessions
          .create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
              {
                amount: 150 * 100,
                currency: "EUR",
                name: `Publicación de la oferta: ${offer.name}`,
                quantity: 1,
              },
            ],
            customer_email: req.currentCompany.email,
            success_url: `${
              process.env.HOST || "http://localhost:3000"
            }/company-profile`,
            cancel_url: `${
              process.env.HOST || "http://localhost:3000"
            }/offer-detail/${offer.id}`,
            metadata: {
              offer: offer.id,
            },
          })
          .then((session) => {
            res.json({
              sessionId: session.id,
            });
          });
      }
    })
    .catch(next);
};

module.exports.webhook = (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_SIGNING_SECRET
    );
  } catch (err) {
    console.error(err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    Offer.findByIdAndUpdate(
      session.metadata.offer,
      {
        paid: true,
      },
      {
        new: true,
      }
    )
      .then(() => {
        req.flash(
          "flashMessage",
          "The payment was successful - The offer has been published!"
        );
        console.log(
          `Offer with id ${session.metadata.offer} has been published`
        );
        res.status(200).end();
      })
      .catch((err) => {
        console.log("Payment failed");
        next(err);
      });
  } else {
    res.status(200).end();
  }
};

module.exports.edit = (req, res, next) => {
  Offer.findById(req.params.id)
    .then((offerToEdit) => {
      console.log(offerToEdit);
      if (offerToEdit.offers_publishedByCompany == req.currentCompany.id) {
        console.log("if", offerToEdit);
        res.render("offers/offerCreation", {
          ...offerToEdit.toJSON(),
          lat: offerToEdit.location.coordinates[1],
          lng: offerToEdit.location.coordinates[0],
        });
      } else {
        res.render("denied-route");
      }
    })
    .catch((err) => next(err));
};

module.exports.doEdit = (req, res, next) => {
  function renderWithErrors(errors) {
    res.status(400).render("offers/offerCreation", {
      errors: errors,
      offer: req.body,
      lat: req.body.lat,
      lng: req.body.lng,
    });
  }
  req.body.location = {
    type: "Point",
    coordinates: [req.body.lng, req.body.lat],
  };
  Offer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
    .then((offerToEdit) => {
      if (offerToEdit.offers_publishedByCompany == req.currentCompany.id) {
        res.redirect("/company-profile");
      } else {
        res.render("denied-route");
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.delete = (req, res, next) => {
  Application.findOne({
    offer: req.params.id,
  })
    .populate("offer")
    .then((application) => {
      if (application) {
        application.offer.active = false;
        application.save();
      }
      Offer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      }).then((offer) => {
        offer.active = false;
        offer.save();
        res.redirect("/company-profile");
      });
    })
    .catch((err) => next(err));
};

module.exports.search = (req, res, next) => {
  // Optimized search
  const query = Object.fromEntries(
    Object.entries(req.query)
      .filter(([_, v]) => !!v)
      .map(([k, v]) => [k, { $regex: v, $options: "i" }])
  );

  Offer.find({ $and: [query, { active: true }, { paid: true }] })
    .sort("-createdAt")
    .populate("offers_publishedByCompany")
    .then((offers) => {
      return res.render("offers/offersList", {
        offers,
        query: req.query,
      });
    })
    .catch((err) => next(err));

  // Test active + paid
  if (req.query.address) {
    Offer.find({ $and: [{ active: true }, { paid: true }] })
      .populate("offers_publishedByCompany")
      .then((offers) => {
        const queryAddress = req.query.address.toLowerCase().slice(1);
        let filteredOffers = [];
        offers.forEach((offer) => {
          const cityOffer = offer.address;
          if (cityOffer.includes(queryAddress)) {
            filteredOffers.push(offer);
          }
        });
        return filteredOffers;
      })
      .then((offers) =>
        res.render("offers/offersList", {
          offers,
        })
      );
  } else if (req.query.category) {
    Offer.find({
      $and: [
        { active: true },
        { paid: true },
        { category: req.query.category },
      ],
    })
      .populate("offers_publishedByCompany")
      .then((offers) => {
        res.render("offers/offersList", {
          offers,
        });
      });
  } else if (req.query.contract) {
    Offer.find({
      $and: [
        { active: true },
        { paid: true },
        { contract: req.query.contract },
      ],
    })
      .populate("offers_publishedByCompany")
      .then((offers) => {
        res.render("offers/offersList", {
          offers,
        });
      });
  } else if (req.query.studies) {
    Offer.find({
      $and: [{ active: true }, { paid: true }, { studies: req.query.studies }],
    })
      .populate("offers_publishedByCompany")
      .then((offers) => {
        res.render("offers/offersList", {
          offers,
        });
      });
  } else if (req.query.experience) {
    Offer.find({
      $and: [
        { active: true },
        { paid: true },
        { experience: req.query.experience },
      ],
    })
      .populate("offers_publishedByCompany")
      .then((offers) => {
        console.log("offers", offers);
        res.render("offers/offersList", {
          offers,
        });
      });
  } else if (req.query.salary) {
    Offer.find({
      $and: [{ active: true }, { paid: true }, { salary: req.query.salary }],
    })
      .populate("offers_publishedByCompany")
      .then((offers) => {
        return res.render("offers/offersList", {
          offers,
        });
      });
  } else {
    next();
  }
};
