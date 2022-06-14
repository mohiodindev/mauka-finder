const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const EMAIL_PATTERN =
  /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
const SALT_ROUNDS = 10;

const Candidateschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
    },
    surname: {
      type: String,
      required: [true, "Please enter your surname"],
      trim: true,
    },
    age: {
      type: Number,
      min: 18,
      max: 120,
      trim: true,
    },
    address: {
      type: String,
      // streetName: String,
      // number: Number,
      // zipCode: Number,
      // city: String,
      // country: String
    },
    email: {
      type: String,
      required: [true, "Email Is Required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_PATTERN, "Email Is Should Match The Pattren"],
    },
    phone: {
      type: Number,
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
      match: [
        PASSWORD_PATTERN,
        "The password must have at least 8 characters, 1 uppercase, 1 lowercase and 1 number",
      ],
    },
    resume: {
      type: String,
    },
    social: {
      google: String,
      linkedin: String,
    },
    skills: {
      type: [String],
      enum: [
        "creativity",
        "teamwork",
        "organization",
        "motivation",
        "communication",
        "commitment",
        "I work under pressure",
      ],
    },
    picture: {
      type: String,
      default:
        "https://winaero.com/blog/wp-content/uploads/2015/05/windows-10-user-account-login-icon.png",
    },
    cv: {
      type: String,
    },
    linkedin: {
      type: String,
      validate: {
        validator: (text) => {
          return text.indexOf("https://www.linkedin.com/") === 0;
        },
        message:
          "Your LinkedIn profile link should start with https://www.linkedin.com/",
      },
    },
    role: {
      type: String,
      default: "CANDIDATE",
    },
    active: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: uuidv4(),
    },
    //token temporal
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

Candidateschema.virtual("applications", {
  ref: "Application",
  localField: "_id",
  foreignField: "candidate",
});

Candidateschema.methods.getAddress = function () {
  const { streetName, number, zipCode, city, country } = this.address;
  return `${streetName} nº${number}, ${zipCode} ${city} (${country})`;
};

Candidateschema.methods.checkPassword = function (passwordToCheck) {
  return bcrypt.compare(passwordToCheck, this.password);
};

Candidateschema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, SALT_ROUNDS).then((hash) => {
      this.password = hash;
      next();
    });
  } else {
    next();
  }
});

const Candidate = mongoose.model("Candidate", Candidateschema);

module.exports = Candidate;
