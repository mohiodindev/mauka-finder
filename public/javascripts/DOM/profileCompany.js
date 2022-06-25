const showMoreBtns = document.querySelectorAll(".show-more");
//console.log(showMoreBtns)

showMoreBtns.forEach((showMoreBtn) =>
  showMoreBtn.addEventListener("click", (event) => {
    const description =
      event.target.parentElement.querySelector("#description");
    description.classList.toggle("d-none");

    if (description.className != "d-none") {
      showMoreBtn.innerHTML = "See Less";
    } else {
      showMoreBtn.innerHTML = "See More";
    }
  })
);

document.getElementById("show-more-profile").addEventListener("click", () => {
  const showMoreBtn = document.getElementById("show-more-profile");
  const description = document.getElementById("description-profile");

  description.classList.toggle("d-none");

  if (description.className != "d-none") {
    showMoreBtn.innerHTML = "See Less";
  } else {
    showMoreBtn.innerHTML = "See More";
  }
});
