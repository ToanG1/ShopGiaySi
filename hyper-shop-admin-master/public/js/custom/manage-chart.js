let myChart = document.getElementById('myChart').getContext('2d');

let massPopChart = new Chart(myChart, {
    type: 'bar',
    data:{
        labels:['monday', 'tuesday', 'thurseday', 'wednesday', 'friday', 'saturday', 'sunday'],
        datasets:[{
            label: 'Number of Order',
            data:[
                10,
                20,
                13,
                15,
                17,
                7,
                2
            ]
        }]
    }
})