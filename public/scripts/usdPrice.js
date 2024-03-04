// Fetch data from the API
fetch('http://localhost:3002/getRateUSDtoTHBforDb')
  .then(response => response.json())
  .then(data => {
    const sortedData = data.resultData.sort((a, b) => {
      return new Date(a.period) - new Date(b.period);
    });
    const dates = sortedData.map(entry => entry.period);
    const rates = sortedData.map(entry => parseFloat(entry.rate));
    console.log("dates = ",dates)


    // Create a new chart
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Exchange Rate (USD to THB)',
          data: rates,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            position: 'right', // ตำแหน่งของแกน y ที่มีอยู่ข้างขวา
            ticks: {
              beginAtZero: false
            }
          }]
        }
      }
      
    });
  });
