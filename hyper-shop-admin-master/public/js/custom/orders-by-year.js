const urlYear = "/admins/get-revenue-year"
const loaderYear = document.querySelector('#loader-year');

let yearChart = document.getElementById('yearChart').getContext('2d');

const getOrdersByYear = async ()=>{
    const currentYear = new Date().getFullYear();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov','Dec']
    await fetch(urlYear, {
        method: "POST",
        body: JSON.stringify({months, year: currentYear}),
        headers:{
            "Content-type":"application/json; charset=utf-8"
        }
    }).then(response=>{
        if(response.status>=200&&response.status<300){
            return response.json().then(result=>{
                loaderYear.classList.add('hidden');
                let newYearChart = new Chart(yearChart, {
                    type: 'line',
                    data:{
                        labels: months,
                        datasets: [{
                          label: 'Order per month',
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
