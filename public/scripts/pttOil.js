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
    let chart;

    const updateChartSize = () => {
        const domElement = document.getElementById('oilChart');
        const computedStyle = window.getComputedStyle(domElement); // Get computed styles

        // Set chart width and height from CSS styles
        const width = parseInt(computedStyle.width);
        const height = parseInt(computedStyle.height);

        if (chart) {
            chart.resize(width, height); // Resize the chart
        } else {
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
            getData().then(data => {
                lineSeries.setData(data);
            });
        }
    };

    // Call updateChartSize initially and on window resize
    updateChartSize();
    window.addEventListener('resize', updateChartSize);
};

displayChart();
