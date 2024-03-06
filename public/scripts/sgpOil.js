fetch("http://127.0.0.1:3002/getSgdOilPrice")
  .then((response) => response.json())
  .then((data) => {
    const oilPrices = data.resultData.map((entry) => ({
      time: entry.oilsgd_time,
      value: parseFloat(entry.oilsgd_value),
    }));

    const times = oilPrices.map((price) => {
      // Parse the time string into hours, minutes, and seconds
      const [hours, minutes, seconds] = price.time.split(":");
      
      // Create a new date object with the current date and extracted time
      const utcTime = new Date();
      utcTime.setUTCHours(hours, minutes, seconds);

      // Convert the time to Thailand time
      const thailandTime = new Date(utcTime.getTime() + (7 * 60 * 60 * 1000)); // Add 7 hours for Thailand time
      return thailandTime.toISOString().slice(11, 19); // Extract only HH:mm:ss from ISO string
    });

    const values = oilPrices.map((price) => price.value);

    // Output extracted times to console
    console.log("Extracted Times:", times);

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
  var barrelInput = document.getElementById("barrel");
  var barrelValue = barrelInput.value;

  var litInput = document.getElementById("literTest");
  var litValue = litInput.value;

  const apiUrl = `http://127.0.0.1:3002/getConvertBarreltoLiter?barrel=${barrelValue}`;
  const litUrl = `http://127.0.0.1:3002/getConvertLitertoBarrel?litter=${litValue}`;

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

    fetch(litUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const literInput = document.getElementById("barrelTest");
      literInput.value = data;
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}
