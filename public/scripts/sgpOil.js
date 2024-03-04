const getData = async () => {
    const res = await fetch("http://localhost:3002/getSgdOilPrice"); // เปลี่ยน URL ที่นี่
    const jsonData = await res.json();
    const cdata = jsonData.resultData.map((data) => {
      const { oilsgd_time, oilsgd_value } = data; // ปรับการเข้าถึงข้อมูลใหม่ที่ต้องการ
      const timeParts = oilsgd_time.split(':');
      const datetime = new Date().setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), parseInt(timeParts[2]), 0); // สร้างวันที่ใหม่จากเวลาที่ให้มา
      console.log("datetime = ",datetime)
      return {
        time: datetime,
        value: parseFloat(oilsgd_value),
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