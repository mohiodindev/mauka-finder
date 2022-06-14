const showMoreBtns1 = document.querySelectorAll(".show-me");
//console.log(showMoreBtns1)

showMoreBtns1.forEach((showMoreBtn) =>
  showMoreBtn.addEventListener("click", (event) => {
    //console.log(event.target)
    const description1 =
      event.target.parentElement.querySelector("#description1");
    //console.log('description1', description1)
    description1.classList.toggle("d-none");

    if (description1.className != "d-none") {
      showMoreBtn.innerHTML = "See More";
    } else {
      showMoreBtn.innerHTML = "See More";
    }
  })
);
