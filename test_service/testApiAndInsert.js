const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const { JSDOM } = require('jsdom');
const { Client, Pool } = require('pg');

const url1 = 'http://localhost:3002/getCurrentOilPrice?language=en';
const url2 = 'http://localhost:3002/getCurrentOilPriceProvincial?language=en&provincial=' + encodeURIComponent('Mukdahan');
const params3 = new URLSearchParams({
    language: 'en',
    dd: 3,
    mm: 3,
    yyyy: 2024,
});
const url3 = `http://localhost:3002/getOilPrice?${params3.toString()}`;
// url3 จะมีรูปแบบ http://localhost:3002/getOilPrice?language=en&dd=3&mm=3&yyyy=2024
const params4 = new URLSearchParams({
    language: 'en',
    dd: 3,
    mm: 3,
    yyyy: 2024,
    provincial: encodeURIComponent('Mukdahan')
});
const url4 = `http://localhost:3002/getOilPriceProvincial?${params4.toString()}`;
// url4 จะมีรูปแบบ http://localhost:3002/getOilPriceProvincial?language=en&dd=3&mm=3&yyyy=2024&provincial=Mukdahan
const params5 = new URLSearchParams({
    dd: 4,
    mm: 3,
    yyyy: 2022,
});
const url5 = `http://localhost:3002/getOilPriceList?${params5.toString()}`;
// url5 จะมีรูปแบบ http://localhost:3002/getOilPriceList?language=en&dd=15&mm=2&yyyy=2024
const params6 = new URLSearchParams({
    language: 'en',
    dd: 1,
    mm: 3,
    yyyy: 2024,
    provincial: encodeURIComponent('Bangkok')
});
const url6 = `http://localhost:3002/getOilPriceProvincialList?${params6.toString()}`;
// url6 จะมีรูปแบบ http://localhost:3002/getOilPriceProvincialList?language=en&dd=2&mm=2&yyyy=2024&provincial=Bangkok
const params7 = new URLSearchParams({
    dd: 4,
    mm: 6,
    yyyy: 204,
});
const url7 = `http://localhost:3002/getRateUSDtoTHB?${params7.toString()}`;
// url7 จะมีรูปแบบ http://localhost:3002/getRateUSDtoTHB?dd=15&mm=2&yyyy=2024
const url8 = `http://localhost:3002/getSingaporeOil`;
const url9 = `http://localhost:3002/getConvertUSDtoTHB?usd=35`;
const url10 = `http://localhost:3002/getConvertTHBtoUSD?thb=1000`;
const url11 = `http://localhost:3002/getConvertBarreltoLiter?barrel=150`;
const url12 = `http://localhost:3002/getPttOilPrice`;
const url13 = `http://localhost:3002/getSgdOilPrice`
const url14 = `http://localhost:3002/getRateUSDtoTHBforDb`;

// main //

testGetApiService();
// insertRateUsdThb(); // ย้อนหลัง 1 เดือน จากวันที่กำหนด dd/mm/yyyy
// insertPtt(); // ย้อนหลังจากวันที่กำหนด dd/mm/yyyy เลย (Error insert บ่อย)

// ---- //

// test api
async function testGetApiService() {
    axios.get(`http://localhost:3002/getPttDiesel`)
        .then(async (response) => {
            console.log('Status:', response.status);
            console.log('Data:', response.data);

            // สร้างอ็อบเจ็กต์เพื่อเก็บข้อมูลราคาตามเดือน
            let monthlyPrices = {};

            // วนลูปผ่านข้อมูลราคาทุกรายการ
            response.data.resultData.forEach(item => {
                // แปลงวันที่ในรูปแบบ string เป็น Date object
                let priceDate = new Date(item.price_date);
                // ดึงเดือนและปีออกมา
                let monthYear = priceDate.getMonth() + 1 + '/' + priceDate.getFullYear();

                // ถ้ายังไม่มีข้อมูลราคาสำหรับเดือนนี้ ให้สร้างอาเรย์ว่าง
                if (!monthlyPrices[monthYear]) {
                    monthlyPrices[monthYear] = [];
                }

                // เก็บราคาลงในอาเรย์ของเดือนนี้
                monthlyPrices[monthYear].push(parseFloat(item.price));
            });

            // สร้างอ็อบเจ็กต์เพื่อเก็บค่าเฉลี่ยของราคาทุกเดือน
            let averagePrices = {};

            // วนลูปผ่านข้อมูลราคาทุกเดือน
            for (let monthYear in monthlyPrices) {
                // คำนวณค่าเฉลี่ยของราคาสำหรับเดือนนี้
                let total = monthlyPrices[monthYear].reduce((acc, curr) => acc + curr, 0);
                let average = total / monthlyPrices[monthYear].length;

                // เก็บค่าเฉลี่ยไว้ในอ็อบเจ็กต์ averagePrices
                averagePrices[monthYear] = average.toFixed(3); // ปัดเลขทศนิยมเป็น 3 ตำแหน่ง
            }

            // แสดงผลลัพธ์
            console.log(averagePrices);

        })
        .catch((error) => {
            console.error('Error:', error.message);
        });
}

// insert data
async function insertRateUsdThb() {
    axios.get(url7)
        .then(async (response) => {
            console.log('Status:', response.status);
            console.log('Data:', response.data);

            let dataUsdThb = response.data.result.data.data_detail;

            console.log(dataUsdThb);

            const client = new Client({
                user: 'ford_ser',
                host: '10.161.112.160',
                database: 'oil_price_cloud',
                password: '1q2w3e4r',
                port: 5432,
            });

            (async () => {
                try {
                    await client.connect();

                    for (const item of dataUsdThb) {
                        const query = 'INSERT INTO rate_usd_thb (period, rate) VALUES ($1, $2) ON CONFLICT (period, rate) DO NOTHING';
                        const values = [item.period, item.rate];
                        await client.query(query, values);
                    }

                    console.log('Data inserted successfully');
                } catch (error) {
                    console.error('Error inserting data:', error);
                } finally {
                    await client.end();
                }
            })();
        })
        .catch((error) => {
            console.error('Error:', error.message);
        });
}
async function insertPtt() {
    try {
        const response = await axios.get(url5);
        console.log('Status:', response.status);
        console.log('Data:', response.data);

        const xmlString = response.data['soap:Envelope'];
        let allGetOilPriceResponse = [];
        xmlString.forEach((response, index) => {
            console.log(`Response ${index + 1}:`);
            allGetOilPriceResponse.push(response['soap:Body']['GetOilPriceResponse']);
        });

        console.log(allGetOilPriceResponse);

        const pool = new Pool({
            user: 'ford_ser',
            host: '10.161.112.160',
            database: 'oil_price_cloud',
            password: '1q2w3e4r',
            port: 5432,
        });

        await Promise.all(allGetOilPriceResponse.map(async (entry) => {
            const xmlString = entry.GetOilPriceResult;
            const parsedData = await parseXML(xmlString);
            console.log(parsedData);

            try {
                const client = await pool.connect();

                const queries = parsedData.map(async (fuelInfo) => {
                    const { PRICE_DATE, PRODUCT, PRICE } = fuelInfo;
                    const query = `
                        INSERT INTO ptt_oil_price (price_date, product, price)
                        VALUES ($1, $2, $3)
                    `;

                    const values = [PRICE_DATE, PRODUCT, PRICE];

                    try {
                        await client.query(query, values);
                        console.log('Data inserted successfully');
                    } catch (error) {
                        if (error.code === '23505' && error.constraint === 'unique_ptt_data') {
                            console.log('Duplicate data found, skipping insertion');
                        } else {
                            throw error;
                        }
                    }
                });

                await Promise.all(queries);
                await client.release();
            } catch (error) {
                console.error('Error executing query', error);
            }
        }));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// common functions
async function parseXML(xmlString) {
    const dom = new JSDOM(xmlString);
    const document = dom.window.document;
    const fuelElements = document.querySelectorAll('FUEL');
    const fuels = [];

    fuelElements.forEach(fuelElement => {
        const PRICE_DATE = fuelElement.querySelector('PRICE_DATE').textContent;
        const PRODUCT = fuelElement.querySelector('PRODUCT').textContent;
        const PRICE = fuelElement.querySelector('PRICE').textContent;
        fuels.push({ PRICE_DATE, PRODUCT, PRICE });
    });

    return fuels;
}
