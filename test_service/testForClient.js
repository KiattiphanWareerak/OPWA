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
    dd: 3,
    mm: 3,
    yyyy: 2020,
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
    dd: 3,
    mm: 1,
    yyyy: 2024,
});
const url7 = `http://localhost:3002/getRateUSDtoTHB?${params7.toString()}`;
// url7 จะมีรูปแบบ http://localhost:3002/getRateUSDtoTHB?dd=15&mm=2&yyyy=2024

const url8 = `http://localhost:3002/getSingaporeOil`;

const url9 = `http://localhost:3002/getConvertUSDtoTHB?usd=35`;

const url10 = `http://localhost:3002/getConvertTHBtoUSD?thb=1000`;

const url11 = `http://localhost:3002/getConvertBarreltoLiter?barrel=150`;

const url12 = `http://localhost:3002/getPttOilPrice`;

const url13 = `http://localhost:3002/getSgdOilPrice`;

const url14 = `http://localhost:3002/getPttDiesel`;

const url15 = `http://localhost:3002/getRateUSDtoTHBforDb`;

axios.get(url15)
    .then(async (response) => {
        console.log('Status:', response.status);
        console.log('Data:', response.data);
    })
    .catch((error) => {
        console.error('Error:', error.message);
    });

// axios.get(url7)
//     .then(async (response) => {
//         console.log('Status:', response.status);
//         console.log('Data:', response.data);

//         let dataUsdThb = response.data.result.data.data_detail;

//         console.log(dataUsdThb);

//         const client = new Client({
//             user: 'ford_ser',
//             host: '10.161.112.160',
//             database: 'oil_price_cloud',
//             password: '1q2w3e4r',
//             port: 5432,
//         });
  
//         (async () => {
//             try {
//                 await client.connect();
        
//                 for (const item of dataUsdThb) {
//                     const query = 'INSERT INTO rate_usd_thb (period, rate) VALUES ($1, $2)';
//                     const values = [item.period, item.rate];
//                     await client.query(query, values);
//                 }
        
//                 console.log('Data inserted successfully');
//             } catch (error) {
//                 console.error('Error inserting data:', error);
//             } finally {
//                 await client.end();
//             }
//         })();
//     })
//     .catch((error) => {
//         console.error('Error:', error.message);
//     });

// axios.get(url5)
//     .then((response) => {
//         console.log('Status:', response.status);
//         console.log('Data:', response.data);

//         const xmlString = response.data['soap:Envelope'];
//         // console.log(xmlString);

//         let allGetOilPriceResponse = [];
//         xmlString.forEach((response, index) => {
//             console.log(`Response ${index + 1}:`);
//             // console.log(response['soap:Body']['GetOilPriceResponse']);

//             allGetOilPriceResponse.push(response['soap:Body']['GetOilPriceResponse']);
//         });

//         console.log(allGetOilPriceResponse);

//         allGetOilPriceResponse.forEach(async entry => {
//             const xmlString = entry.GetOilPriceResult;
//             const parsedData = await parseXML(xmlString);
//             console.log(parsedData);
//             // db
//             const pool = new Pool({
//                 user: 'ford_ser',
//                 host: '10.161.112.160',
//                 database: 'oil_price_cloud',
//                 password: '1q2w3e4r',
//                 port: 5432,
//                 max: 20, // จำนวน clients สูงสุดที่สามารถเชื่อมต่อได้พร้อมกัน
//                 idleTimeoutMillis: 30000, // เวลาที่ clients จะถูกทำลายหากไม่มีการใช้งาน
//                 connectionTimeoutMillis: 2000, // เวลาที่จะทำการ timeout ในการเชื่อมต่อ
//             });

//             try {
//                 const client = await pool.connect();
        
//                 const queries = parsedData.map(async (fuelInfo) => {
//                     const { PRICE_DATE, PRODUCT, PRICE } = fuelInfo;
//                     const query = `
//                         INSERT INTO ptt_oil_price (price_date, product, price)
//                         VALUES ($1, $2, $3)
//                     `;
        
//                     const values = [PRICE_DATE, PRODUCT, PRICE];
        
//                     return client.query(query, values);
//                 });
        
//                 await Promise.all(queries);
        
//                 client.release(); // คืน client กลับไปยัง pool
        
//                 console.log("Data inserted successfully");
//             } catch (error) {
//                 console.error('Error executing query', error);
//             }
//         });
          
//         async function parseXML(xmlString) {
//             const dom = new JSDOM(xmlString);
//             const document = dom.window.document;
//             const fuelElements = document.querySelectorAll('FUEL');
//             const fuels = [];
          
//             fuelElements.forEach(fuelElement => {
//               const PRICE_DATE = fuelElement.querySelector('PRICE_DATE').textContent;
//               const PRODUCT = fuelElement.querySelector('PRODUCT').textContent;
//               const PRICE = fuelElement.querySelector('PRICE').textContent;
//               fuels.push({ PRICE_DATE, PRODUCT, PRICE });
//             });
          
//             return fuels;
//         }
//     })
//     .catch((error) => {
//         console.error('Error:', error.message);
//     });

// axios.get(url5)
//     .then(async (response) => {
//         console.log('Status:', response.status);
//         console.log('Data:', response.data);

//         const xmlString = response.data.parsedData['soap:Envelope']['soap:Body'].CurrentOilPriceResponse.CurrentOilPriceResult;
//         const dom = new JSDOM(xmlString);
//         const document = dom.window.document;
//         const fuelElements = document.getElementsByTagName('FUEL');

//         const fuelArray = [];
//         for (let i = 0; i < fuelElements.length; i++) {
//             const fuelElement = fuelElements[i];
//             const priceDate = fuelElement.querySelector('PRICE_DATE').textContent;
//             const product = fuelElement.querySelector('PRODUCT').textContent;
//             const price = fuelElement.querySelector('PRICE').textContent;
          
//             const fuelInfo = {
//               "PRICE_DATE": priceDate,
//               "PRODUCT": product,
//               "PRICE": price
//             };
          
//             fuelArray.push(fuelInfo);
//         }
          
//         console.log(fuelArray);

//         const client = new Client({
//             user: 'ford_ser',
//             host: '10.161.112.160',
//             database: 'oil_price_cloud',
//             password: '1q2w3e4r',
//             port: 5432,
//         });

//         await client.connect();

//         const queries = fuelArray.map(async (fuelInfo) => {
//             const { PRICE_DATE, PRODUCT, PRICE } = fuelInfo;
//             const query = `
//                 INSERT INTO ptt_oil_price (price_date, product, price)
//                 VALUES ($1, $2, $3)
//             `;
                
//             const values = [PRICE_DATE, PRODUCT, PRICE];
                
//             return client.query(query, values);
//         });

//         await Promise.all(queries);

//         await client.end();
        
//         console.log("Data inserted successfully");
//     })
//     .catch((error) => {
//         console.error('Error:', error.message);
//     });
