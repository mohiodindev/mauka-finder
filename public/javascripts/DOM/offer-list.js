//OFFERS LIST
window.onscroll = (ev) => {
  if (window.scrollY > 65 && document.body.scrollTop <= 0) {
    //   document.getElementById('offer-list-navbar').classList.add('fixed-top');
    document.getElementById("offer-list-navbar").classList.add("bg-white");
  } else if (window.scrollY < 30) {
    //   document.getElementById('offer-list-navbar').classList.remove('fixed-top');
    document.getElementById("offer-list-navbar").classList.remove("bg-white");
  }
};

let showFilters = document.getElementById("show-filters");
showFilters.addEventListener("click", () => {
  document.getElementById("offer-list").classList.toggle("d-none");
  document.getElementById("filters").classList.toggle("d-none");

  if (showFilters.innerHTML === "Filters") {
    showFilters.innerHTML = "Close";
    showFilters.classList.remove("btn-outline-primary");
    showFilters.classList.add("btn-success");
  } else {
    showFilters.innerHTML = "Filters";
    showFilters.classList.remove("btn-success");
    showFilters.classList.add("btn-outline-primary");
  }
});

let showDescriptions = document.querySelectorAll(".show-description");
showDescriptions.forEach((showDescriptionBtn) =>
  showDescriptionBtn.addEventListener("click", (event) => {
    const description =
      event.target.parentElement.parentElement.parentElement.parentElement.querySelector(
        "#description"
      );
    description.classList.toggle("d-none");

    if (showDescriptionBtn.innerHTML === "See More") {
      showDescriptionBtn.innerHTML = "See More";
    } else {
      showDescriptionBtn.innerHTML = "See More";
    }
  })
);
