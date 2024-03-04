fetch("http://localhost:3002/getSgdOilPrice")
  .then((response) => response.json())
  .then((data) => {
    const oilPrices = data.resultData.map((entry) => ({
      time: entry.oilsgd_time,
      value: parseFloat(entry.oilsgd_value),
    }));

    const times = oilPrices.map((price) => price.time);
    const values = oilPrices.map((price) => price.value);

    const ctx = document.getElementById("myChart").getContext("2d");
    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: times,
        datasets: [
          {
            label: "SGD Oil Price",
            data: values,
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
              position: "right",
              ticks: {
                beginAtZero: false,
              },
            },
          ],
        },
      },
    });
  });

const convertBtn = document.getElementById("convert-value");
convertBtn.addEventListener("click", convertAndDisplayResult);

function convertAndDisplayResult() {
  const barrelInput = document.getElementById("barrel");
  const barrelValue = barrelInput.value;

  const apiUrl = `http://localhost:3002/getConvertBarreltoLiter?barrel=${barrelValue}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const literInput = document.getElementById("liter");
      literInput.value = data;
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}

displayChart();
