const urlMonth = "/admins/get-revenue-month"
const loaderMonth = document.querySelector('#loader-month');

let monthChart = document.getElementById('lineChart').getContext('2d');

function getDaysInMonth(month, year) {
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
        let dt = new Date(date);
        
        days.push(new Date(date).toDateString());
        date.setDate(date.getDate() + 1);
    }
    return days;
}

const getOrdersByMonth = async ()=>{
    var dt = new Date();
    var month = dt.getMonth();
    var year = dt.getFullYear();
    const days = getDaysInMonth(month, year);
    await fetch(urlMonth, {
        method: "POST",
        body: JSON.stringify(days),
        headers:{
            "Content-type":"application/json; charset=utf-8"
        }
    }).then(response=>{
        if(response.status>=200&&response.status<300){
            return response.json().then(result=>{
                const newLabel = []
                for(let day of days){
                    newLabel.push(day.substring(4,10));
                }
                loaderMonth.classList.add('hidden');
                let newMonthChart = new Chart(monthChart, {
                    type: 'line',
                    data:{
                        labels: newLabel,
                        datasets: [{
                          label: 'Order per day',
                          data: result,
                          fill: false,
                          borderColor: 'rgb(75, 192, 192)',
                          tension: 0.1
                        }]
                    }
                })
            })
        }
    })
}
