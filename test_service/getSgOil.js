const axios = require('axios');

async function getSingaporeOil() {
    const options = {
        method: 'GET',
        url: 'https://www.exchangerates.org.uk/commodities_update.php?1708953275419',
        headers: {
            "x-requested-with": "XMLHttpRequest",
        }
      };

    return new Promise(async (resolve, reject) => {
        axios(options)
        .then(response => {
            console.log('Singapore oil response...');
            console.log(response.data);

            resolve(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    });
}

getSingaporeOil();
