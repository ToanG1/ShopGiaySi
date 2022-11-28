let dateChart = document.getElementById("dateChart").getContext("2d");

const url = "/admins/get-revenue-dates";

const getDaysInWeek = (current) => {
  var week = [];
  // Starting Monday not Sunday
  if (current.getDay() == 0) {
    current.setDate(current.getDate() - 1);
  }
  current.setDate(current.getDate() - current.getDay() + 1);
  for (var i = 0; i < 7; i++) {
    week.push(new Date(current).toDateString());
    current.setDate(current.getDate() + 1);
  }
  return week;
};

const getOrdersByDates = async () => {
  const today = new Date();
  const week = getDaysInWeek(today);
  await fetch(url, {
    method: "POST",
    body: JSON.stringify(week),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  }).then((response) => {
    if (response.status >= 200 && response.status < 300) {
      return response.json().then((result) => {
        let newDateChart = new Chart(dateChart, {
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
                data: result,
              },
            ],
          },
        });
      });
    }
  });
};

document.onload = getOrdersByDates();
