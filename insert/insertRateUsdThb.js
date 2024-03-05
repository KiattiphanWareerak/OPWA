const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const { JSDOM } = require('jsdom');
const { Client, Pool } = require('pg');

async function insertRateUsdThb(day, month, year) {
    const params = new URLSearchParams({
        dd: day,
        mm: month,
        yyyy: year,
    });

    const url = `http://10.161.112.160:3002/getRateUSDtoTHB?${params.toString()}`;

    try {
        const response = await axios.get(url);
        console.log('Status:', response.status);
        console.log('Data:', response.data);

        let dataUsdThb = response.data.result.data.data_detail;
        console.log(dataUsdThb);

        const client = new Client({
            user: 'ford_ser',
            host: '10.161.112.160',
            database: 'postgres',
            password: '1q2w3e4r',
            port: 5432,
        });

        await client.connect();

        for (const item of dataUsdThb) {
            const query = 'INSERT INTO rate_usd_thb (period, rate) VALUES ($1, $2) ON CONFLICT (period, rate) DO NOTHING';
            const values = [item.period, item.rate];
            await client.query(query, values);
        }

        console.log('Data inserted successfully');
        await client.end();
    } catch (error) {
        console.error('Error:', error.message);
    }

    // Decrement month for the next call
    month--;

    // If month becomes 0, set it to 12 and decrement year
    if (month === 0) {
        month = 12;
        year--;
    }

    // If year becomes less than 2023, terminate recursion
    if (year < 2022) {
        return;
    }

    // Call insertRateUsdThb recursively with updated date values
    await insertRateUsdThb(5, month, year);
}

// Start inserting data with initial date: 5th March 2024
insertRateUsdThb(5, 3, 2024);
