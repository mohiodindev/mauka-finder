const mongoose = require("mongoose");
const Candidate = require("../models/candidate.model");
const Offer = require("../models/offer.model");

const applicationSchema = new mongoose.Schema(
  {
    offer: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Offer",
      required: true,
    },
    candidate: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Candidate",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
