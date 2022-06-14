const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    description: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    skills: {
      type: [String],
    },
    category: {
      type: String,
    },
    contract: {
      type: String,
    },
    studies: {
      type: String,
    },
    experience: {
      type: String,
      // min: 1,
      // max: 60,
    },
    salary: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    offers_publishedByCompany: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Company",
      required: true,
    },
    paid: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

offerSchema.index({ location: "2dsphere" });

offerSchema.virtual("applications", {
  ref: "Application",
  localField: "_id",
  foreignField: "offer",
});

offerSchema.methods.getAddress = function () {
  const { streetName, number, zipCode, city, country } = this.address;
  return `${streetName} nº${number}, ${zipCode} ${city} (${country})`;
};

const Offer = mongoose.model("Offer", offerSchema);

module.exports = Offer;
