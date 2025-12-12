const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");
const thumbs = Array.from(document.querySelectorAll(".thumb"));
const mainImage = document.getElementById("mainImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dotsWrap = document.getElementById("dots");
const addToCart = document.getElementById("addToCart");
const fragranceRadios = document.querySelectorAll('input[name="fragrance"]');
const purchaseRadios = document.querySelectorAll('input[name="purchase"]');
const singleSub = document.getElementById("singleSub");
const doubleSub = document.getElementById("doubleSub");
const nums = document.querySelectorAll(".num");

let currentIndex = 0;

// Hamburger toggle
hamburger.addEventListener("click", () => {
  const expanded = hamburger.getAttribute("aria-expanded") === "true";
  hamburger.setAttribute("aria-expanded", String(!expanded));
  if (mobileNav.hasAttribute("hidden")) {
    mobileNav.removeAttribute("hidden");
  } else {
    mobileNav.setAttribute("hidden", "");
  }
});

// Gallery setup
function setActiveIndex(index) {
  index = (index + thumbs.length) % thumbs.length;
  thumbs.forEach((t, i) => {
    t.classList.toggle("active", i === index);
    t.setAttribute("aria-selected", String(i === index));
  });
  const src =
    thumbs[index].dataset.src || thumbs[index].querySelector("img").src;
  // lazy-load - if data-src provided
  mainImage.src = src;
  currentIndex = index;
  updateDots();
}
thumbs.forEach((t, i) => {
  t.addEventListener("click", () => setActiveIndex(i));
  t.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveIndex(i);
    }
  });
});

// Prev/Next
if (prevBtn && nextBtn) {
  prevBtn.addEventListener("click", () => setActiveIndex(currentIndex - 1));
  nextBtn.addEventListener("click", () => setActiveIndex(currentIndex + 1));
}

// Dots
function updateDots() {
  dotsWrap.innerHTML = "";
  thumbs.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.className = "dot";
    btn.type = "button";
    btn.title = "Go to image " + (i + 1);
    btn.textContent = "•";
    if (i === currentIndex) btn.setAttribute("aria-current", "true");
    btn.addEventListener("click", () => setActiveIndex(i));
    dotsWrap.appendChild(btn);
  });
}
updateDots();
setActiveIndex(0);

// Radio logic -> update add-to-cart
function updateAddToCart() {
  const frag = document.querySelector('input[name="fragrance"]:checked')?.value;
  const purch = document.querySelector('input[name="purchase"]:checked')?.value;
  if (!frag || !purch) return;
  const url = `https://example.com/cart?product=gtg&frag=${encodeURIComponent(
    frag
  )}&purchase=${encodeURIComponent(purch)}`;
  addToCart.href = url;
}

// Expandable subscription sections
function handlePurchaseChange() {
  document.querySelectorAll(".expandable").forEach((e) => {
    e.classList.add("hidden");
    e.setAttribute("aria-hidden", "true");
  });
  const sel = document.querySelector('input[name="purchase"]:checked');
  if (sel && sel.dataset.expand) {
    const id = sel.dataset.expand;
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove("hidden");
      el.setAttribute("aria-hidden", "false");
    }
  }
  updateAddToCart();
}

fragranceRadios.forEach((r) => r.addEventListener("change", updateAddToCart));
purchaseRadios.forEach((r) =>
  r.addEventListener("change", handlePurchaseChange)
);
updateAddToCart();
handlePurchaseChange();

// Count up when section in view
let counted = false;
function easeOutQuad(t) {
  return t * (2 - t);
}

function countUp() {
  if (counted) return;
  const section = document.getElementById("percentSection");
  if (!section) return;
  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    counted = true;
    nums.forEach((el) => {
      const target = Number(el.dataset.target) || 0;
      const duration = 1200;
      const start = performance.now();
      function step(now) {
        const time = Math.min(1, (now - start) / duration);
        const eased = easeOutQuad(time);
        const current = Math.floor(eased * target);
        el.textContent = current + "%";
        if (time < 1) requestAnimationFrame(step);
        else el.textContent = target + "%";
      }
      requestAnimationFrame(step);
    });
  }
}
window.addEventListener("scroll", countUp);
window.addEventListener("resize", countUp);
window.addEventListener("load", countUp);

// Accessibility: allow keyboard navigation for dots (delegated)
dotsWrap.addEventListener("keydown", (e) => {
  const focusable = Array.from(dotsWrap.querySelectorAll("button"));
  const idx = focusable.indexOf(document.activeElement);
  if (e.key === "ArrowRight") {
    focusable[(idx + 1) % focusable.length].focus();
  } else if (e.key === "ArrowLeft") {
    focusable[(idx - 1 + focusable.length) % focusable.length].focus();
  }
});

// Lazy loading placeholder: ensure mainImage has src on load if missing
if (!mainImage.src || mainImage.src.endsWith("null")) {
  const first = thumbs[0];
  if (first && first.dataset.src) mainImage.src = first.dataset.src;
}
