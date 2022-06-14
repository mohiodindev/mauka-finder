//OFFERS LIST
window.onscroll = (ev) => {
  if (window.scrollY > 65 && document.body.scrollTop <= 0) {
    document
      .getElementById("application-list-navbar")
      .classList.add("fixed-top");
    document
      .getElementById("application-list-navbar")
      .classList.add("bg-white");
  } else if (window.scrollY < 30) {
    document
      .getElementById("application-list-navbar")
      .classList.remove("fixed-top");
    document
      .getElementById("application-list-navbar")
      .classList.remove("bg-white");
  }
};

let showOfferDetail = document.getElementById("show-offer-detail");
document.getElementById("show-offer-detail").addEventListener("click", () => {
  document.getElementById("offer-detail").classList.toggle("d-none");

  if (showOfferDetail.innerHTML === "See More") {
    showOfferDetail.innerHTML = "See More";
  } else {
    showOfferDetail.innerHTML = "See More";
  }
});

let showAppfiltersBtn = document.getElementById("show-app-filters");
showAppfiltersBtn.addEventListener("click", () => {
  document.getElementById("app-filters").classList.toggle("d-none");

  if (showAppfiltersBtn.innerHTML === "Filters") {
    showAppfiltersBtn.innerHTML = "Close";
  } else {
    showAppfiltersBtn.innerHTML = "Filters";
  }
});

function addFakeCandidate(n) {
  for (i = 0; i < n; i++) {
    document.getElementById("fake-candidate").innerHTML += `
        <div class="d-flex flex-column align-items-center col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-4">
            <img class="profile-img img-fluid"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDO90KrTj9OJdcyg1ZIc9Ol7CMyKucyhmc6w&usqp=CAU" alt="Profile Picture">
            <h5 class="p-2 text-center"><b>Antonio <br> García López</b></h5>
        </div>
        <div class="d-flex flex-column align-items-center col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-4">
        <img class="profile-img img-fluid"
            src="http://1.gravatar.com/avatar/7d5f7a9f5926aa8e4ed7702a65906167?s=400&" alt="Profile Picture">
            <h5 class="p-2 text-center"><b>Carmen <br> Rodríguez Díaz</b></h5>
        </div>
        <div class="d-flex flex-column align-items-center col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-4">
            <img class="profile-img img-fluid"
                src="https://dipierro-fotografo.com/wp-content/uploads/elementor/thumbs/fotografia-linkedin-profesional-madrid-2-o7bi1hd06mfepk2fglh01jtld1i59d6091y6j3ouuk.jpg" alt="Profile Picture">
            <h5 class="p-2 text-center"><b>Carlos <br> Romero González</b></h5>
        </div>
        <div class="d-flex flex-column align-items-center col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-4">
        <img class="profile-img img-fluid"
            src="https://dipierro-fotografo.com/wp-content/uploads/elementor/thumbs/fotografia-linkedin-profesional-2-o7bi1hd06mfepk2fglh01jtld1i59d6091y6dbb2f4.jpg" alt="Profile Picture">
            <h5 class="p-2 text-center"><b>María <br> Muñoz Alonso</b></h5>
        </div>
    `;
  }
}

addFakeCandidate(Math.ceil(Math.random() * 30) + 5);

// const exampleModal = document.getElementById('exampleModal')
// exampleModal.addEventListener('show.bs.modal', function (event) {
//   // Button that triggered the modal
//   const button = event.relatedTarget
//   // Extract info from data-bs-* attributes
//   const recipient = button.getAttribute(`${id}`)
//   // If necessary, you could initiate an AJAX request here
//   // and then do the updating in a callback.
//   //
//   // Update the modal's content.
//   const modalTitle = exampleModal.querySelector('.modal-title')
//   const modalBodyInput = exampleModal.querySelector('.modal-body input')

//   modalTitle.textContent = 'New message to ' + recipient
//   modalBodyInput.value = recipient
// })
