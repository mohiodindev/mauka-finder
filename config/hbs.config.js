const hbs = require("hbs");
const path = require("path");

hbs.registerPartials(path.join(__dirname, "../views/partials"));

hbs.registerHelper("unlessSocialCandidate", (currentCandidate, options) => {
  if (!currentCandidate.social.google && !currentCandidate.social.linkedin) {
    return options.fn();
  }
  return options.inverse();
});

hbs.registerHelper("unlessSocialCompany", (currentCompany, options) => {
  if (!currentCompany.social.google && !currentCompany.social.linkedin) {
    return options.fn();
  }
  return options.inverse();
});
