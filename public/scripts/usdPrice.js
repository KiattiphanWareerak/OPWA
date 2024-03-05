// Fetch data from the API
fetch("http://10.161.112.160:3002/getRateUSDtoTHBforDb")
  .then((response) => response.json())
  .then((data) => {
    const sortedData = data.resultData.sort((a, b) => {
      return new Date(a.period) - new Date(b.period);
    });
    const dates = sortedData.map((entry) => entry.period);
    const rates = sortedData.map((entry) => parseFloat(entry.rate));
    console.log("dates = ", dates);

    // Create a new chart
    const ctx = document.getElementById("myChart").getContext("2d");
    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Exchange Rate (USD to THB)",
            data: rates,
            backgroundColor: "rgba(33, 150, 243, 0.2)", // สีฟ้าอ่อนโปร่งใส
            borderColor: "rgba(33, 150, 243, 1)", // สีฟ้าอ่อนทึบ
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              position: "right", // ตำแหน่งของแกน y ที่มีอยู่ข้างขวา
              ticks: {
                beginAtZero: false,
              },
            },
          ],
        },
      },
    });
  });

const convertBtn = document.getElementById("convert-value-usd");
convertBtn.addEventListener("click", convertAndDisplayResult);

function convertAndDisplayResult() {
  const usInput = document.getElementById("usd");
  const usValue = usInput.value;
  const bahtInput = document.getElementById("bahtTest");
  const bahtValue = bahtInput.value;

  const apiUrl = `http://10.161.112.160:3002/getConvertUSDtoTHB?usd=${usValue}`;
  const bahtUrl = `http://10.161.112.160:3002/getConvertTHBtoUSD?thb=${bahtValue}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const bahtInput = document.getElementById("baht");
        bahtInput.value = data;
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });

    fetch(bahtUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const usInput = document.getElementById("usdTest");
        usInput.value = data;
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
}
