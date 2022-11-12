const address = document.getElementById("addressCheckout");
const delivery = document.getElementById("deliveryCheckout");
const payment = document.getElementById("paymentCheckout");
const review = document.getElementById("reviewCheckout");

const addressNavBtn = document.getElementById("addressNavBtn");
const deliveryNavBtn = document.getElementById("deliveryNavBtn");
const paymentNavBtn = document.getElementById("paymentNavBtn");
const orderNavBtn = document.getElementById("orderNavBtn");

const addressCheckoutBtn = document.getElementById("addressCheckoutBtn");
const deliveryCheckoutBtn = document.getElementById("deliveryCheckoutBtn");
const paymentCheckoutBtn = document.getElementById("paymentCheckoutBtn");
const reviewCheckoutBtn = document.getElementById("reviewCheckoutBtn");

addressCheckoutBtn.addEventListener("click", () => {
  address.classList.remove("hidden");
  delivery.classList.add("hidden");
  payment.classList.add("hidden");
  review.classList.add("hidden");
});

deliveryCheckoutBtn.addEventListener("click", () => {
  address.classList.add("hidden");
  delivery.classList.remove("hidden");
  payment.classList.add("hidden");
  review.classList.add("hidden");
});

paymentCheckoutBtn.addEventListener("click", () => {
  address.classList.add("hidden");
  delivery.classList.add("hidden");
  payment.classList.remove("hidden");
  review.classList.add("hidden");
});

reviewCheckoutBtn.addEventListener("click", () => {
  address.classList.add("hidden");
  delivery.classList.add("hidden");
  payment.classList.add("hidden");
  review.classList.remove("hidden");
});
