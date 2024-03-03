const getData = async () => {
    const res = await fetch('dataTest.json');
    const jsonData = await res.json();
    const cdata = jsonData.map((data) => {
        const { DATE, PRICE } = data;
        const datetime = new Date(DATE).getTime() / 1000;
        return {
            time: datetime,
            value: parseFloat(PRICE),
        };
    });
    return cdata;
};

const displayChart = async () => {
    const chartProperties = {
        width: 1500,
        height: 600,
        timeScale: {
            timeVisible: true,
            secondsVisible: true,
        },
    };

    const domElement = document.getElementById('oilChart');
    const chart = LightweightCharts.createChart(domElement, chartProperties);
    const lineSeries = chart.addLineSeries();
    const data = await getData();
    lineSeries.setData(data);
};


displayChart();

