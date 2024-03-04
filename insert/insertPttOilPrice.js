const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const { JSDOM } = require('jsdom');
const { Client, Pool } = require('pg');

const params = new URLSearchParams({
    dd: 4,
    mm: 3,
    yyyy: 2022,
});
const url = `http://localhost:3002/getOilPriceList?${params.toString()}`;

async function insertPtt() {
    try {
        const response = await axios.get(url);
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

insertPtt();

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
