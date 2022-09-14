const nodemailer = require("nodemailer");
const { generateCandidateTemplate } = require("./mailtemplate.js");
const { generateCompanyTemplate } = require("./mailtemplate.js");
const {
  generateCandidatePasswordUpdateTemplate,
} = require("./mailtemplate.js");
const { generateCandidateEmailUpdateTemplate } = require("./mailtemplate.js");
const { generateCompanyPasswordUpdateTemplate } = require("./mailtemplate.js");
const { generateCompanyEmailUpdateTemplate } = require("./mailtemplate.js");
const { generateDeleteCandidateTemplate } = require("./mailtemplate.js");
const { generateDeleteCompanyTemplate } = require("./mailtemplate.js");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.NM_USER,
    pass: process.env.NM_PASSWORD,
  },
});

module.exports.sendCandidateActivationEmail = (email, token) => {
  transporter.sendMail({
    from: `Mauka-Finder <${process.env.NM_USER}>`,
    to: email,
    subject: "Thanks For Joinning Us",
    html: generateCandidateTemplate(token),
  });
};

module.exports.sendCompanyActivationEmail = (email, token) => {
  transporter.sendMail({
    from: `Mauka-Finder <${process.env.NM_USER}>`,
    to: email,
    subject: "Thanks For Joinning Us",
    html: generateCompanyTemplate(token),
  });
};

// module.exports.sendCandidatesocialEmail = (email, token) => {
//     transporter.sendMail({
//         from: `HireHack <${process.env.NM_USER}>`,
//         to: email,
//         subject: 'Thanks For Joinning Us',
//         html: generateSocialCandidateWelcomeTemplate()
//     });
// }

// module.exports.sendCompaniesocialEmail = (email, token) => {
//     transporter.sendMail({
//         from: `HireHack <${process.env.NM_USER}>`,
//         to: email,
//         subject: 'Thanks For Joinning Us',
//         html: generateSocialCompanyWelcomeTemplate()
//     });
// }

module.exports.sendCandidatePasswordUpdateEmail = (email, token) => {
  transporter.sendMail({
    from: `Mauka-Finder <${process.env.NM_USER}>`,
    to: email,
    subject: "Confirm your password change",
    html: generateCandidatePasswordUpdateTemplate(token),
  });
};

module.exports.sendCompanyPasswordUpdateEmail = (email, token) => {
  transporter.sendMail({
    from: `Mauka-Finder<${process.env.NM_USER}>`,
    to: email,
    subject: "Confirm your password change",
    html: generateCompanyPasswordUpdateTemplate(token),
  });
};

module.exports.sendCandidateEmailUpdateEmail = (email, token) => {
  transporter.sendMail({
    from: `Mauka-Finder <${process.env.NM_USER}>`,
    to: email,
    subject: "Confirm your Email change",
    html: generateCandidateEmailUpdateTemplate(token),
  });
};

module.exports.sendCompanyEmailUpdateEmail = (email, token) => {
  transporter.sendMail({
    from: `Mauka-Finder <${process.env.NM_USER}>`,
    to: email,
    subject: "Confirm your Email change",
    html: generateCompanyEmailUpdateTemplate(token),
  });
};

module.exports.sendDeleteCandidateEmail = (email, token) => {
  transporter.sendMail({
    from: `Mauka-Finder <${process.env.NM_USER}>`,
    to: email,
    subject: "Confirm your withdrawal from Mauka-Finder",
    html: generateDeleteCandidateTemplate(token),
  });
};

module.exports.sendDeleteCompanyEmail = (email, token) => {
  transporter.sendMail({
    from: `Mauka-Finder <${process.env.NM_USER}>`,
    to: email,
    subject: "Confirm your withdrawal from Mauka-Finder",
    html: generateDeleteCompanyTemplate(token),
  });
};
