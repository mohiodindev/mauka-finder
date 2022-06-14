require("dotenv").config();
const faker = require("faker");
require("../config/db.config");
const Candidate = require("../models/candidate.model");
const Company = require("../models/company.model");
const Offer = require("../models/offer.model");

Promise.all([Offer.deleteMany(), Company.deleteMany()]).then(() => {
  for (let i = 0; i < 10; i++) {
    Company.create({
      name: faker.company.companyName(),
      address: {
        streetName: faker.address.streetName(),
        number: Math.floor(Math.random() * 200),
        zipCode: faker.address.zipCode(),
        city: faker.address.city(),
        country: faker.address.country(),
      },
      email: faker.internet.email(),
      website: faker.internet.url(),
      picture: faker.image.business(),
    }).then((company) => {
      console.log(
        `Created companies ${company.name}, website: ${company.website}`
      );
      for (let j = 0; j < 5; j++) {
        Offer.create({
          name: faker.name.jobTitle(),
          offers_publishedByCompany: company._id,
          description: faker.lorem.paragraph(),
          address: faker.address.streetAddress(),
          skills: getRandom(
            [
              "creativity",
              "teamwork",
              "organization",
              "motivation",
              "communication",
              "commitment",
              "I work under pressure",
            ],
            Math.floor(Math.random() * 6) + 1
          ),
          location: {
            type: "Point",
            coordinates: [faker.address.longitude(), faker.address.latitude()],
          },
          category: getOneRandom([
            "Adm.Companies",
            "Customer Support",
            "Purchasing, logistics and warehouse",
            "Education and formation",
            "Finance and Banking",
            "IT and Telecoms",
            "Engineers and technicians",
            "Legal",
            "Marketing and Communication",
            "HR",
            "Health",
            "Tourism",
            "Other",
          ]),
          contract: getOneRandom([
            "Undefined",
            "Fixed-term",
            "Autonomous",
            "Others contractos",
          ]),
          studies: getOneRandom([
            "No Studies",
            "Compulsory Secondary Education",
            "Intermediate",
            "Graduate",
            "Diploma",
          ]),
          experience: Math.floor(Math.random(faker.random.number()) * 40),
          salary: getOneRandom(["6K - 12k", "12K - 20K", "20K - 30K", "+ 30K"]),
        }).then((offer) =>
          console.log(`Created offer: ${offer.name}, skills: ${offer.skills}`)
        );
      }
    });
  }
});

function getRandom(arr, n) {
  let result = new Array(n);
  let len = arr.length;
  let taken = new Array(len);
  while (n--) {
    let x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

function getOneRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
