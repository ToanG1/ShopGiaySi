let myChart = document.getElementById("myChart").getContext("2d");

let massPopChart = new Chart(myChart, {
  type: "bar",
  data: {
    labels: [
      "Thứ hai",
      "Thứ ba",
      "Thứ tư",
      "Thứ năm",
      "Thứ sáu",
      "Thứ bảy",
      "Chủ nhật",
    ],
    datasets: [
      {
        label: "Số đơn hàng",
        data: [10, 20, 13, 15, 17, 7, 2],
      },
    ],
  },
});
