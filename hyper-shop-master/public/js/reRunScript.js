for (let btn of document.getElementsByClassName('addToCartBtn')) {
  btn.addEventListener('click', addToCartHandler);
}

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl),
);
