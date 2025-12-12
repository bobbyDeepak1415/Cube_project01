// Hamburger
const hamburgerBtn = document.getElementById("hamburgerBtn");
const navMenu = document.getElementById("navMenu").querySelector("ul");

hamburgerBtn.addEventListener("click", () => {
  navMenu.classList.toggle("show");
});

// Product Gallery 
const mainImage = document.getElementById("mainImage");
const thumbsContainer = document.getElementById("thumbsContainer");
const thumbs = thumbsContainer.querySelectorAll("img");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dotsContainer = document.getElementById("dotsContainer");

const galleryImages = ["assets/img1.jpg", "assets/img2.jpg", "assets/img3.jpg"];
let currentIndex = 0;

// Dots
galleryImages.forEach((img, i) => {
  const dot = document.createElement("span");
  dot.dataset.index = i;
  if (i === 0) dot.classList.add("active");
  dotsContainer.appendChild(dot);
});

const dots = dotsContainer.querySelectorAll("span");

// Updating gallery 
function updateGallery(index) {
  currentIndex = index;
  mainImage.src = galleryImages[currentIndex];

  // Updating active thumbnail
  thumbs.forEach((t) => t.classList.remove("active"));
  thumbs[currentIndex].classList.add("active");

  // Updating dots
  dots.forEach((d) => d.classList.remove("active"));
  dots[currentIndex].classList.add("active");
}

// Thumbnails clicking
thumbs.forEach((t) => {
  t.addEventListener("click", (e) => {
    updateGallery(parseInt(e.target.dataset.index));
  });
});

// Arrows clicking
prevBtn.addEventListener("click", () => {
  let index = currentIndex - 1;
  if (index < 0) index = galleryImages.length - 1;
  updateGallery(index);
});

nextBtn.addEventListener("click", () => {
  let index = currentIndex + 1;
  if (index >= galleryImages.length) index = 0;
  updateGallery(index);
});

// Dots clicking
dots.forEach((d) => {
  d.addEventListener("click", (e) => {
    updateGallery(parseInt(e.target.dataset.index));
  });
});

//  Add to Cart
const fragranceRadios = document.querySelectorAll("input[name='frag']");
const purchaseRadios = document.querySelectorAll("input[name='purchase']");
const addToCartBtn = document.getElementById("addToCart");

const subscriptionSingle = document.getElementById("singleSubDetails");
const subscriptionDouble = document.getElementById("doubleSubDetails");

function updateAddToCart() {
  const frag = document.querySelector("input[name='frag']:checked");
  const purchase = document.querySelector("input[name='purchase']:checked");

  // Expand or collapse subscription details
  subscriptionSingle.style.display =
    purchase?.value === "single-sub" ? "block" : "none";
  subscriptionDouble.style.display =
    purchase?.value === "double-sub" ? "block" : "none";

  if (frag && purchase) {
    addToCartBtn.href = `https://dummycart.com/add?frag=${frag.value}&type=${purchase.value}`;
  }
}

// Event listeners
fragranceRadios.forEach((r) => r.addEventListener("change", updateAddToCart));
purchaseRadios.forEach((r) => r.addEventListener("change", updateAddToCart));

// Percentage Count-Up 
const statsSection = document.getElementById("statsSection");
const counts = statsSection.querySelectorAll(".count");
let counted = false;

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top <= window.innerHeight && rect.bottom >= 0;
}

function countUp() {
  if (!counted && isInViewport(statsSection)) {
    counts.forEach((c) => {
      const target = parseInt(c.dataset.target);
      let current = 0;
      const increment = Math.ceil(target / 100);

      const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
          c.textContent = target + "%";
          clearInterval(counter);
        } else {
          c.textContent = current + "%";
        }
      }, 20);
    });
    counted = true;
  }
}

window.addEventListener("scroll", countUp);
window.addEventListener("load", countUp);
