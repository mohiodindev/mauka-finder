const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { company } = require("faker");
const { v4: uuidv4 } = require("uuid");

const EMAIL_PATTERN =
  /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
const SALT_ROUNDS = 10;

const Companieschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name Is Required"],
    },
    address: {
      streetName: String,
      number: String,
      zipCode: String,
      city: String,
      country: String,
    },
    email: {
      type: String,
      required: [true, "Email Is Required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_PATTERN, "Email Is Should Match The Pattren"],
    },
    password: {
      type: String,
      //required: [true, "Password is Required"],
      match: [
        PASSWORD_PATTERN,
        "The password must have at least 8 characters, 1 uppercase, 1 lowercase and 1 number",
      ],
    },
    description: {
      type: String,
    },
    picture: {
      type: String,
      default:
        "https://i.pcmag.com/imagery/articles/03WHIruaSljeZnevrNKJX7j-12..1582137780.jpg",
    },
    website: {
      type: String,
    },
    social: {
      google: String,
      linkedin: String,
    },
    role: {
      type: String,
      default: "COMPANY",
    },
    active: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: uuidv4(),
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

Companieschema.virtual("offers_publishedByCompany", {
  ref: "Offer",
  localField: "_id",
  foreignField: "company",
});

Companieschema.methods.getAddress = function () {
  const { streetName, number, zipCode, city, country } = this.address;
  return `${streetName} nº${number}, ${zipCode} ${city} (${country})`;
};

Companieschema.methods.checkPassword = function (passwordToCheck) {
  return bcrypt.compare(passwordToCheck, this.password);
};

Companieschema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, SALT_ROUNDS).then((hash) => {
      this.password = hash;
      next();
    });
  } else {
    next();
  }
});

const Company = mongoose.model("Company", Companieschema);

module.exports = Company;
