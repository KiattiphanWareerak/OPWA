const getData = async () => {
    const res = await fetch("http://localhost:3002/getSgdOilPrice");
    const jsonData = await res.json();
    const cdata = jsonData.resultData.map((data) => {
        const { oilsgd_time, oilsgd_value } = data;
        const timeParts = oilsgd_time.split(':').map(part => parseInt(part));
        const datetime = new Date();
        datetime.setHours(timeParts[0], timeParts[1], timeParts[2], 0);
        console.log("datetime = ", datetime);
        return {
            time: datetime.getTime(), // Change to getTime() to get milliseconds
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
    console.log("linedata = ", linedata);

    lineSeries.setData(linedata);
};

displayChart();
