document.getElementById("show-skills").addEventListener("click", () => {
  document.getElementById("skills").classList.remove("d-none");
  //document.getElementById('skills').classList.add('d-flex');
  document.getElementById("employment").classList.add("d-none");
  document.getElementById("employment").classList.remove("d-flex");
});

document.getElementById("show-employment").addEventListener("click", () => {
  document.getElementById("employment").classList.remove("d-none");
  document.getElementById("employment").classList.add("d-flex");
  document.getElementById("skills").classList.add("d-none");
  //document.getElementById('skills').classList.remove('d-flex');
});

document.onscroll = () => {
  const slides = document.querySelector(".parallax");
  //console.log(slides)

  let diff = slides.getBoundingClientRect().top;
  let speed = slides.dataset.speed;
  let axis = slides.dataset.axis;

  let horizontalSum = diff * speed;
  //let verticalSum = diff * speed

  // if (axis === 'horizontal') verticalSum = 0
  // if (axis === 'vertical') horizontalSum = 0

  slides.style.transform = `translate(${horizontalSum}px, 0px)`;
};
