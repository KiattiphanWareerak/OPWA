const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const { JSDOM } = require('jsdom');
const { Client, Pool } = require('pg');

const params = new URLSearchParams({
    dd: 4,
    mm: 6,
    yyyy: 204,
});

const url = `http://localhost:3002/getRateUSDtoTHB?${params.toString()}`;

async function insertRateUsdThb() {
    axios.get(url)
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

insertRateUsdThb();
