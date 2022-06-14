//DELETE
function clicked(input) {
  return confirm(`Are you sure?`);
}

function update(input) {
  return confirm(`Are You Sure?`);
}

// FLASH
setTimeout(() => {
  document.querySelectorAll(".toast").forEach((toast) => {
    console.log(toast);
    new bootstrap.Toast(toast).hide();
  });
}, 3000);

// //PAGINATION
document.getElementById("page").addEventListener("click", () => {
  const pageValue = document.getElementById("page").innerHTML;
  console.log(pageValue);

  axios
    .get(`http://localhost:3000/offers-list?page=${pageValue}`)
    .then((response) => console.log(response));
});

let loadMore = 1;
document.getElementById("load-more").addEventListener("click", () => {
  loadMore++;
  console.log(loadMore);
  axios
    .get(`http://localhost:3000/offers-list?page=${loadMore}`)
    .then((response) => console.log(response));
});

window.onscroll = (ev) => {
  if (window.scrollY > 2 && document.body.scrollTop <= 0) {
    document.getElementById("navbar").classList.add("fixed-top");
    document.getElementById("navbar").classList.add("bg-white");
  } else if (window.scrollY < 2) {
    document.getElementById("navbar").classList.remove("fixed-top");
    document.getElementById("navbar").classList.remove("bg-white");
  }
};
