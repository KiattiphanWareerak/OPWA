const getData = async () => {
  try {
      const res = await fetch("http://localhost:3002/getRateUSDtoTHBforDb");
      const jsonData = await res.json();
      
      if (!jsonData.resultData || jsonData.resultData.length === 0) {
          throw new Error("No result data found");
      }

      const cdata = jsonData.resultData.map((data) => {
          const { period, rate } = data;
      
          // Split the period string into year, month, and day parts
          const [year, month, day] = period.split('-');
      
          // Add leading zeros to month and day if they are single digits
          const formattedMonth = month.padStart(2, '0');
          const formattedDay = day.padStart(2, '0');
      
          // Create a new date string in the format "month-day-year"
          const newDateString = `${month}-${day}-${year}`;
      
          // Create a new Date object from the new date string and get its timestamp
          const datetime = new Date(newDateString).getTime();
          const value = parseFloat(rate);
      
          if (isNaN(value)) {
              throw new Error(`Invalid rate value: ${rate}`);
          }
      
          return {
              time: datetime,
              value: value,
          };
      });    
      return cdata;
  } catch (error) {
      console.error("Error fetching or transforming data:", error);
      return []; // Return an empty array to avoid passing null data to the chart
  }
};

const displayChart = async () => {
  try {
      const chartProperties = {
        width: 1250,
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
      console.log("linedata = ", linedata);
      lineSeries.setData(linedata);
  } catch (error) {
      console.error("Error displaying chart:", error);
  }
};

displayChart();
