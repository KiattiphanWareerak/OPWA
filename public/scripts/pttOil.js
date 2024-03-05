let chart;

const getData = async (url) => {

  const res = await fetch(url);
  const data = await res.json();

  const cdata = data.resultData.map((item) => {
    const { price_date, price } = item;
    const datetime = new Date(price_date).getTime() / 1000;
    return {
      time: datetime,
      value: parseFloat(price),
    };
  });
  
  return cdata;
};

const displayChart = async (url) => {
  const domElement = document.getElementById("oilChart");
  const computedStyle = window.getComputedStyle(domElement); // Get computed styles

  // Set chart width and height from CSS styles
  const width = parseInt(computedStyle.width);
  const height = parseInt(computedStyle.height);

  if (chart) {
    chart.remove(); // Remove the previous chart
  }

  const chartProperties = {
    width,
    height,
    timeScale: {
      timeVisible: true,
      secondsVisible: true,
    },
  };

  chart = LightweightCharts.createChart(domElement, chartProperties);
  const lineSeries = chart.addLineSeries();

  const data = await getData(url);
  lineSeries.setData(data);
};

// Call displayChart with the default URL
displayChart("http://10.161.112.160:3002/getPttDiesel");

const selectOil = document.getElementById("select-oil");
selectOil.addEventListener("change", function (event) {
  const selectedValue = event.target.value;
  let url = "http://10.161.112.160:3002/getPttDiesel";

  switch (selectedValue) {
    case "Diesel":
      url = "http://10.161.112.160:3002/getPttDiesel";
      break;
    case "Diesel B7":
      url = "http://10.161.112.160:3002/getPttDieselB7";
      break;
    case "Gasohol E85":
      url = "http://10.161.112.160:3002/getPttGasoholE85";
      break;
    case "Gasohol E20":
      url = "http://10.161.112.160:3002/getPttGasoholE20";
      break;
    case "Gasohol 91":
      url = "http://10.161.112.160:3002/getPttGasohol91";
      break;
    case "Gasohol 95":
      url = "http://10.161.112.160:3002/getPttGasohol95";
      break;
    case "Gasoline 95":
      url = "http://10.161.112.160:3002/getPttGasoline95";
      break;
    case "Premium Diesel B7":
      url = "http://10.161.112.160:3002/getPttPremiumDieselB7";
      break;
    case "Super Power GSH95":
      url = "http://10.161.112.160:3002/getPttSuperPowerGSH95";
      break;
    default:
      break;
  }

  displayChart(url);
});
