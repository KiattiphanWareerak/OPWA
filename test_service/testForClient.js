const axios = require('axios');

const url1 = 'http://localhost:3002/getCurrentOilPrice?language=en';
const url2 = 'http://localhost:3002/getCurrentOilPriceProvincial?language=en&provincial=' + encodeURIComponent('Mukdahan');
const params3 = new URLSearchParams({
    language: 'en',
    dd: 15,
    mm: 2,
    yyyy: 2024,
});
const url3 = `http://localhost:3002/getOilPrice?${params3.toString()}`;
// url3 จะมีรูปแบบ http://localhost:3002/getOilPrice?language=en&dd=15&mm=2&yyyy=2024&provincial=Mukdahan
const params4 = new URLSearchParams({
    language: 'en',
    dd: 15,
    mm: 2,
    yyyy: 2024,
    provincial: encodeURIComponent('Mukdahan')
});
const url4 = `http://localhost:3002/getOilPriceProvincial?${params4.toString()}`;
// url4 จะมีรูปแบบ http://localhost:3002/getOilPriceProvincial?language=en&dd=2&mm=2&yyyy=2024&provincial=bangkok
const params5 = new URLSearchParams({
    dd: 15,
    mm: 1,
    yyyy: 2024,
});
const url5 = `http://localhost:3002/getRateUSDtoTHB?${params5.toString()}`;
// url5 จะมีรูปแบบ http://localhost:3002/getRateUSDtoTHB?dd=15&mm=2&yyyy=2024

axios.get(url1)
    .then((response) => {
        console.log('Status:', response.status);
        console.log('Data:', response.data);
    })
    .catch((error) => {
        console.error('Error:', error.message);
    });

axios.get(url2)
    .then((response) => {
        console.log('Status:', response.status);
        console.log('Data:', response.data);
    })
    .catch((error) => {
        console.error('Error:', error.message);
    });

axios.get(url3)
    .then((response) => {
        console.log('Status:', response.status);
        console.log('Data:', response.data);
    })
    .catch((error) => {
        console.error('Error:', error.message);
    });

axios.get(url4)
.then((response) => {
    console.log('Status:', response.status);
    console.log('Data:', response.data);
})
.catch((error) => {
    console.error('Error:', error.message);
});

axios.get(url5)
.then((response) => {
    console.log('Status: ', response.status);
    console.log('Data: ', response.data.result.data.data_detail);
})
.catch((error) => {
    console.error('Error:', error.message);
});