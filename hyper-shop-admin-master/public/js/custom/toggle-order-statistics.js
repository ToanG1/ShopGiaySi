const revenueByDatesBtn = document.getElementById("revenueByDates");
const revenueByMonthBtn = document.getElementById("revenueByMonth");
const revenueByYearBtn = document.getElementById("revenueByYear");

const dateRevenue = document.getElementById("date-revenue");
const monthRevenue = document.getElementById("month-revenue");
const yearRevenue = document.getElementById("year-revenue");

revenueByDatesBtn.addEventListener("click", () => {
  dateRevenue.classList.remove("hidden");
  monthRevenue.classList.add("hidden");
  yearRevenue.classList.add("hidden");
});

revenueByMonthBtn.addEventListener("click", () => {
  dateRevenue.classList.add("hidden");
  monthRevenue.classList.remove("hidden");
  yearRevenue.classList.add("hidden");
  getOrdersByMonth();
});

revenueByYearBtn.addEventListener("click", () => {
  dateRevenue.classList.add("hidden");
  monthRevenue.classList.add("hidden");
  yearRevenue.classList.remove("hidden");
  getOrdersByYear();
});
