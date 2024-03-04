const getData = async () => {
    const res = await fetch("http://localhost:3002/getRateUSDtoTHBforDb"); // เปลี่ยน URL ที่นี่
    const jsonData = await res.json();
    const cdata = jsonData.resultData.map((data) => {
      const { period, rate } = data; // ปรับการเข้าถึงข้อมูลใหม่ที่ต้องการ
      const datetime = new Date(period).getTime(); // สร้างวันที่ใหม่จาก period และแปลงเป็น milliseconds
      console.log("datetime = ",datetime)
      return {
        time: datetime,
        value: parseFloat(rate),
      };
    });
    console.log("cdata = ", cdata);
    return cdata;
  };
  

const displayChart = async () => {
    const chartProperties = {
      width: 1400,
      height: 600,
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    };
  
    const domElement = document.getElementById("oilChart");
    const chart = LightweightCharts.createChart(domElement, chartProperties);
    const lineSeries = chart.addLineSeries();
    const linedata = await getData();
    console.log("linedata = ",linedata)
    lineSeries.setData(linedata);
  };
  
  displayChart();