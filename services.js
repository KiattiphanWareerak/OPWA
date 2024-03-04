// Require module
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { XMLParser } = require('fast-xml-parser');
const { JSDOM } = require('jsdom');
const { Client } = require('pg');

// Endpoint the PTT service
const serviceURL = 'https://orapiweb.pttor.com/oilservice/OilPrice.asmx';

// Set up the server
const app = express();
const port = 3002;
const host = '0.0.0.0';
app.use(cors());

// For parse data
const parser = new XMLParser();

// All routing
app.get('/getCurrentOilPrice', async (req, res) => {
  try {
    const data = await getCurrentOilPrice(req.query.language || 'en');

    const parsedData = parser.parse(data);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ parsedData });
  } catch (error) {
    console.error('Error fetching current oil price:', error);
    res.status(500).send('Error fetching current oil price');
  }
});
app.get('/getCurrentOilPriceProvincial', async (req, res) => {
  try {
    const data = await getCurrentOilPriceProvincial(
      req.query.language || 'en',
      req.query.provincial || 'Bangkok'
    );

    const parsedData = parser.parse(data);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ parsedData });
  } catch (error) {
    console.error('Error fetching current provincial oil price:', error);
    res.status(500).send('Error fetching current provincial oil price');
  }
});
app.get('/getOilPrice', async (req, res) => {
  try {
    // ข้อมูลเฉพาะวันที่กำหนด dd/mm/yyyy
    const currentDate = new Date();

    const data = await getOilPrice(
      req.query.language || 'en',
      req.query.dd || currentDate.getDate(),
      req.query.mm || currentDate.getMonth() + 1,
      req.query.yyyy || currentDate.getFullYear() - 1,
    );

    const parsedData = parser.parse(data);

    res.json(parsedData);
  } catch (error) {
    console.error('Error fetching oil price:', error);
    res.status(500).send('Error fetching oil price');
  }
});
app.get('/getOilPriceProvincial', async (req, res) => {
  try {
    // ข้อมูลเฉพาะวันที่กำหนด dd/mm/yyyy
    const currentDate = new Date();

    const data = await getOilPriceProvincial(
      req.query.language || 'en',
      req.query.dd || currentDate.getDate(),
      req.query.mm || currentDate.getMonth() + 1,
      req.query.yyyy || currentDate.getFullYear() - 1,
      req.query.provincial || 'bangkok'
    );

    const parsedData = parser.parse(data);

    res.json(parsedData);
  } catch (error) {
    console.error('Error fetching oil price:', error);
    res.status(500).send('Error fetching oil price');
  }
});
app.get('/getOilPriceList', async (req, res) => {
  try {
    // ย้อนหลังจากวันที่กำหนด dd/mm/yyyy ถึงปัจจุบัน
    const currentDate = new Date();

    const data = await getHistoricalOilPrices(
      req.query.language || 'en',
      req.query.dd || currentDate.getDate(),
      req.query.mm || currentDate.getMonth() + 1,
      req.query.yyyy || currentDate.getFullYear() - 1,
    );

    const parsedData = parser.parse(data);

    res.json(parsedData);
  } catch (error) {
    console.error('Error fetching oil price list:', error);
    res.status(500).send('Error fetching oil price list');
  }
});
app.get('/getOilPriceProvincialList', async (req, res) => {
  try {
    // ย้อนหลังจากวันที่กำหนด dd/mm/yyyy ถึงปัจจุบัน
    const currentDate = new Date();

    const data = await getHistoricalOilPricesProvincial(
      req.query.language || 'en',
      req.query.dd || currentDate.getDate(),
      req.query.mm || currentDate.getMonth() + 1,
      req.query.yyyy || currentDate.getFullYear() - 1,
      req.query.provincial || 'bangkok'
    );

    const parsedData = parser.parse(data);
    console.log(parsedData);

    res.json(parsedData);
  } catch (error) {
    console.error('Error fetching oil price list:', error);
    res.status(500).send('Error fetching oil price list');
  }
});
app.get('/getRateUSDtoTHB', async (req, res) => {
  try {
    // ย้อนหลังข้อมูล 1 เดือน จากวันที่กำหนด dd/mm/yyyy
    const currentDate = new Date();

    const data = await getRateUSDtoTHB(req.query.dd || currentDate.getDate(),
    req.query.mm || currentDate.getMonth() + 1, 
    req.query.yyyy || currentDate.getFullYear());

    res.json(data);
  } catch (error) {
    console.error('Error fetching RateUSDtoTHB:', error);
    res.status(500).send('Error fetching RateUSDtoTHB');
  }
});
app.get('/getSingaporeOil', async (req, res) => {
  try {
    const data = await getSingaporeOil();

    res.json(data);
  } catch (error) {
    console.error('Error fetching SingaporeOil:', error);
    res.status(500).send('Error fetching SingaporeOil');
  }
});
// Calculate routing
app.get('/getConvertUSDtoTHB', async (req, res) => {
  try {
    const currentDate = new Date();
    const yesterday = new Date();
    yesterday.setDate(currentDate.getDate() - 1);

    const data = await getConvertUSDtoTHB(String(yesterday.getDate()).padStart(2, "0"),
    String(yesterday.getMonth()).padStart(2, "0"), 
    yesterday.getFullYear());

    let result = parseFloat(data.result.data.data_detail[0].rate) * parseFloat(req.query.usd);
    result = result.toFixed(3);
    console.log(data.result.data.data_detail[0].rate + " * " + req.query.usd + " = " + result);

    res.json(result);
  } catch (error) {
    console.error('Error fetching ConvertUSDtoTHB:', error);
    res.status(500).send('Error fetching ConvertUSDtoTHB');
  }
});
app.get('/getConvertTHBtoUSD', async (req, res) => {
  try {
    const currentDate = new Date();
    const yesterday = new Date();
    yesterday.setDate(currentDate.getDate() - 1);

    const data = await getConvertUSDtoTHB(String(yesterday.getDate()).padStart(2, "0"),
    String(yesterday.getMonth()).padStart(2, "0"), 
    yesterday.getFullYear());

    let result = parseFloat(req.query.thb) / parseFloat(data.result.data.data_detail[0].rate);
    result = result.toFixed(3);
    console.log(req.query.thb + " / " + data.result.data.data_detail[0].rate + " = " + result);

    res.json(result);
  } catch (error) {
    console.error('Error fetching getConvertTHBtoUSD:', error);
    res.status(500).send('Error fetching getConvertTHBtoUSD');
  }
});
app.get('/getConvertBarreltoLiter', async (req, res) => {
  try {
    let result = parseFloat(req.query.barrel) * 158.987;
    result = result.toFixed(3);
    console.log(req.query.barrel + " * 158.987 = " + result);

    res.json(result);
  } catch (error) {
    console.error('Error fetching getConvertBarreltoLiter:', error);
    res.status(500).send('Error fetching getConvertBarreltoLiter');
  }
});
app.get('/getConvertLitertoBarrel', async (req, res) => {
  try {
    let result = parseFloat(req.query.litter) / 158.987;
    result = result.toFixed(3);
    console.log(req.query.barrel + " / 158.987 = " + result);

    res.json(result);
  } catch (error) {
    console.error('Error fetching getConvertTHBtoUSD:', error);
    res.status(500).send('Error fetching getConvertTHBtoUSD');
  }
});
// DB routing
app.get('/getPttOilPrice', async (req, res) => {
  try {
    const client = new Client({
        user: 'ford_ser',
        host: '10.161.112.160',
        database: 'oil_price_cloud',
        password: '1q2w3e4r',
        port: 5432,
    });

    await client.connect();

    const query = `
        SELECT * FROM ptt_oil_price ORDER BY TO_TIMESTAMP(price_date, 'MM/DD/YYYY HH:MI:SS AM');
    `;
        
    const result = await client.query(query);

    await client.end();
    
    console.log("get ptt successfully");

    const resultData = result.rows;

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ resultData });
  } catch (error) {
    console.error('Error fetching ptt oil price:', error);
    res.status(500).send('Error fetching ptt oil price');
  }
});
app.get('/getSgdOilPrice', async (req, res) => {
  try {
    const client = new Client({
        user: 'ford_ser',
        host: '10.161.112.160',
        database: 'oil_price_cloud',
        password: '1q2w3e4r',
        port: 5432,
    });

    await client.connect();

    const query = `
        SELECT * FROM sgd_oil_price
    `;
        
    const result = await client.query(query);

    await client.end();
    
    console.log("get sdg successfully");

    const resultData = result.rows;

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ resultData });
  } catch (error) {
    console.error('Error fetching sgd oil price:', error);
    res.status(500).send('Error fetching sgd oil price');
  }
});
app.get('/getRateUSDtoTHBforDb', async (req, res) => {
  try {
    const client = new Client({
        user: 'ford_ser',
        host: '10.161.112.160',
        database: 'oil_price_cloud',
        password: '1q2w3e4r',
        port: 5432,
    });

    await client.connect();

    const query = `
        SELECT * FROM rate_usd_thb
    `;
        
    const result = await client.query(query);

    await client.end();
    
    console.log("get rate usd/thb db successfully");

    const resultData = result.rows;

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ resultData });
  } catch (error) {
    console.error('Error fetching rate usd/thb db:', error);
    res.status(500).send('Error fetching rate usd/thb db');
  }
});
app.get('/getPttDiesel', async (req, res) => {
  try {
    const client = new Client({
        user: 'ford_ser',
        host: '10.161.112.160',
        database: 'oil_price_cloud',
        password: '1q2w3e4r',
        port: 5432,
    });

    await client.connect();

    const query = `
        SELECT * 
        FROM ptt_oil_price 
        WHERE product = 'Diesel' 
        ORDER BY TO_TIMESTAMP(price_date, 'MM/DD/YYYY HH:MI:SS AM')
    `;
        
    const result = await client.query(query);

    await client.end();
    
    console.log("get diesel successfully");

    const resultData = result.rows;

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ resultData });
  } catch (error) {
    console.error('Error fetching ptt oil price:', error);
    res.status(500).send('Error fetching ptt oil price');
  }
});
app.get('/getPttDieselB7', async (req, res) => {
  try {
    const client = new Client({
        user: 'ford_ser',
        host: '10.161.112.160',
        database: 'oil_price_cloud',
        password: '1q2w3e4r',
        port: 5432,
    });

    await client.connect();

    const query = `
        SELECT * 
        FROM ptt_oil_price 
        WHERE product = 'Diesel B7' 
        ORDER BY TO_TIMESTAMP(price_date, 'MM/DD/YYYY HH:MI:SS AM')
    `;
        
    const result = await client.query(query);

    await client.end();
    
    console.log("get diesel b7 successfully");

    const resultData = result.rows;

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ resultData });
  } catch (error) {
    console.error('Error fetching ptt oil price:', error);
    res.status(500).send('Error fetching ptt oil price');
  }
});
app.get('/getPttGasoholE85', async (req, res) => {
  try {
    const client = new Client({
        user: 'ford_ser',
        host: '10.161.112.160',
        database: 'oil_price_cloud',
        password: '1q2w3e4r',
        port: 5432,
    });

    await client.connect();

    const query = `
        SELECT * 
        FROM ptt_oil_price 
        WHERE product = 'Gasohol E85' 
        ORDER BY TO_TIMESTAMP(price_date, 'MM/DD/YYYY HH:MI:SS AM')
    `;
        
    const result = await client.query(query);

    await client.end();
    
    console.log("get Gasohol E85 successfully");

    const resultData = result.rows;

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ resultData });
  } catch (error) {
    console.error('Error fetching ptt oil price:', error);
    res.status(500).send('Error fetching ptt oil price');
  }
});
app.get('/getPttGasoholE20', async (req, res) => {
  try {
    const client = new Client({
        user: 'ford_ser',
        host: '10.161.112.160',
        database: 'oil_price_cloud',
        password: '1q2w3e4r',
        port: 5432,
    });

    await client.connect();

    const query = `
        SELECT * 
        FROM ptt_oil_price 
        WHERE product = 'Gasohol E20' 
        ORDER BY TO_TIMESTAMP(price_date, 'MM/DD/YYYY HH:MI:SS AM')
    `;
        
    const result = await client.query(query);

    await client.end();
    
    console.log("get Gasohol E20 successfully");

    const resultData = result.rows;

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ resultData });
  } catch (error) {
    console.error('Error fetching ptt oil price:', error);
    res.status(500).send('Error fetching ptt oil price');
  }
});
app.get('/getPttGasohol91', async (req, res) => {
  try {
    const client = new Client({
        user: 'ford_ser',
        host: '10.161.112.160',
        database: 'oil_price_cloud',
        password: '1q2w3e4r',
        port: 5432,
    });

    await client.connect();

    const query = `
        SELECT * 
        FROM ptt_oil_price 
        WHERE product = 'Gasohol 91' 
        ORDER BY TO_TIMESTAMP(price_date, 'MM/DD/YYYY HH:MI:SS AM')
    `;
        
    const result = await client.query(query);

    await client.end();
    
    console.log("get Gasohol 91 successfully");

    const resultData = result.rows;

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ resultData });
  } catch (error) {
    console.error('Error fetching ptt oil price:', error);
    res.status(500).send('Error fetching ptt oil price');
  }
});
app.get('/getPttGasohol95', async (req, res) => {
  try {
    const client = new Client({
        user: 'ford_ser',
        host: '10.161.112.160',
        database: 'oil_price_cloud',
        password: '1q2w3e4r',
        port: 5432,
    });

    await client.connect();

    const query = `
        SELECT * 
        FROM ptt_oil_price 
        WHERE product = 'Gasohol 95' 
        ORDER BY TO_TIMESTAMP(price_date, 'MM/DD/YYYY HH:MI:SS AM')
    `;
        
    const result = await client.query(query);

    await client.end();
    
    console.log("get Gasohol 95 successfully");

    const resultData = result.rows;

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ resultData });
  } catch (error) {
    console.error('Error fetching ptt oil price:', error);
    res.status(500).send('Error fetching ptt oil price');
  }
});
app.get('/getPttGasoline95', async (req, res) => {
  try {
    const client = new Client({
        user: 'ford_ser',
        host: '10.161.112.160',
        database: 'oil_price_cloud',
        password: '1q2w3e4r',
        port: 5432,
    });

    await client.connect();

    const query = `
        SELECT * 
        FROM ptt_oil_price 
        WHERE product = 'Gasoline 95' 
        ORDER BY TO_TIMESTAMP(price_date, 'MM/DD/YYYY HH:MI:SS AM')
    `;
        
    const result = await client.query(query);

    await client.end();
    
    console.log("get Gasoline 95 successfully");

    const resultData = result.rows;

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ resultData });
  } catch (error) {
    console.error('Error fetching ptt oil price:', error);
    res.status(500).send('Error fetching ptt oil price');
  }
});
app.get('/getPttPremiumDieselB7', async (req, res) => {
  try {
    const client = new Client({
        user: 'ford_ser',
        host: '10.161.112.160',
        database: 'oil_price_cloud',
        password: '1q2w3e4r',
        port: 5432,
    });

    await client.connect();

    const query = `
        SELECT * 
        FROM ptt_oil_price 
        WHERE product = 'Premium Diesel B7' 
        ORDER BY TO_TIMESTAMP(price_date, 'MM/DD/YYYY HH:MI:SS AM')
    `;
        
    const result = await client.query(query);

    await client.end();
    
    console.log("get Premium Diesel B7 successfully");

    const resultData = result.rows;

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ resultData });
  } catch (error) {
    console.error('Error fetching ptt oil price:', error);
    res.status(500).send('Error fetching ptt oil price');
  }
});
app.get('/getPttSuperPowerGSH95', async (req, res) => {
  try {
    const client = new Client({
        user: 'ford_ser',
        host: '10.161.112.160',
        database: 'oil_price_cloud',
        password: '1q2w3e4r',
        port: 5432,
    });

    await client.connect();

    const query = `
        SELECT * 
        FROM ptt_oil_price 
        WHERE product = 'Super Power GSH95' 
        ORDER BY TO_TIMESTAMP(price_date, 'MM/DD/YYYY HH:MI:SS AM')
    `;
        
    const result = await client.query(query);

    await client.end();
    
    console.log("get Super Power GSH95 successfully");

    const resultData = result.rows;

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ resultData });
  } catch (error) {
    console.error('Error fetching ptt oil price:', error);
    res.status(500).send('Error fetching ptt oil price');
  }
});

// Start the server
app.listen(port, host, () => {
  console.log(`Server listening on port ${host}:${port}`);
});

// Functions for ptt service
async function getCurrentOilPrice(language) {
  const methodName = 'CurrentOilPrice';
  const body = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://www.pttor.com">
  <soapenv:Header/>
  <soapenv:Body>
    <tns:${methodName}>
      <tns:Language>${language}</tns:Language>
    </tns:${methodName}>
  </soapenv:Body>
</soapenv:Envelope>`;

  const headers = {
    'Content-Type': 'text/xml; charset=utf-8',
    'SOAPAction': `http://www.pttor.com/${methodName}`,
  };

  return new Promise(async (resolve, reject) => {
    await axios.post(serviceURL, body, { headers })
      .then(response => {
        console.log('Current oil price response...');
        console.log(response.data);
        resolve(response.data);
      })
      .catch(error => {
        console.error('Error fetching oil price:', error);
        reject(error);
      });
  });
}
async function getCurrentOilPriceProvincial(language, provincial) {
  const methodName = 'CurrentOilPriceProvincial';
  const body = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://www.pttor.com">
 <soapenv:Header/>
  <soapenv:Body>
    <tns:${methodName}>
      <tns:Language>${language}</tns:Language>
      <tns:Province>${provincial}</tns:Province>
    </tns:${methodName}>
  </soapenv:Body>
</soapenv:Envelope>`;

  const headers = {
    'Content-Type': 'text/xml; charset=utf-8',
    'SOAPAction': `http://www.pttor.com/${methodName}`,
  };

  return new Promise(async (resolve, reject) => {
    await axios.post(serviceURL, body, { headers })
      .then(response => {
        console.log('Current oil price provincial response...');
        console.log(response.data);
        resolve(response.data);
      })
      .catch(error => {
        console.error('Error fetching provincial oil price:', error);
        reject(error);
      });
  });
}
async function getOilPrice(language, dd, mm, yyyy) {
  const methodName = 'GetOilPrice';
  const body = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://www.pttor.com">
 <soapenv:Header/>
  <soapenv:Body>
    <tns:${methodName}>
      <tns:Language>${language}</tns:Language>
      <tns:DD>${dd}</tns:DD>
      <tns:MM>${mm}</tns:MM>
      <tns:YYYY>${yyyy}</tns:YYYY>
    </tns:${methodName}>
  </soapenv:Body>
</soapenv:Envelope>`;

  const headers = {
    'Content-Type': 'text/xml; charset=utf-8',
    'SOAPAction': `http://www.pttor.com/${methodName}`,
  };

  return new Promise(async (resolve, reject) => {
  await axios.post(serviceURL, body, { headers })
      .then(response => {
        console.log('Oil price response...');
        console.log(response.data);
        resolve(response.data);
      })
      .catch(error => {
        console.error('Error fetching Oil price:', error);
        reject(error);
      });
  });
}
async function getOilPriceProvincial(language, dd, mm, yyyy, provincial) {
  const methodName = 'GetOilPriceProvincial';
  const body = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://www.pttor.com">
 <soapenv:Header/>
  <soapenv:Body>
    <tns:${methodName}>
      <tns:Language>${language}</tns:Language>
      <tns:DD>${dd}</tns:DD>
      <tns:MM>${mm}</tns:MM>
      <tns:YYYY>${yyyy}</tns:YYYY>
      <tns:Province>${provincial}</tns:Province>
    </tns:${methodName}>
  </soapenv:Body>
</soapenv:Envelope>`;

  const headers = {
    'Content-Type': 'text/xml; charset=utf-8',
    'SOAPAction': `http://www.pttor.com/${methodName}`,
  };

  return new Promise(async (resolve, reject) => {
    await axios.post(serviceURL, body, { headers })
      .then(response => {
        console.log('Oil price provincial response...');
        console.log(response.data);
        resolve(response.data);
      })
      .catch(error => {
        console.error('Error fetching Oil price provincial:', error);
        reject(error);
      });
  });
}
async function getRateUSDtoTHB(dd, mm, yyyy) {
  const currentDate = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(currentDate.getMonth() - 1);

  let pdd, pmm, pyyyy;
  let dago, mago, yago;

  if ( dd === currentDate.getDay()
    && mm === (currentDate.getMonth() +1)
    && yyyy === currentDate.getFullYear()) {
      if ( oneMonthAgo.getMonth() < 0 ) {
        dago = String(dd).padStart(2, '0');
        mago = '12';
        yago = currentDate.getFullYear() - 1;
      } else if ( oneMonthAgo.getMonth() = 0 ) {
        dago = String(dd).padStart(2, '0');
        mago = '01';
        yago = currentDate.getFullYear();
      } else {
        dago = String(dd).padStart(2, '0');
        mago =  String(currentDate.getMonth()).padStart(2, '0');
        yago = currentDate.getFullYear();
      }
  } else {
    pdd = String(dd).padStart(2, '0');
    pmm = String(mm).padStart(2, '0');
    pyyyy = yyyy;

    if ( mm === '1' || mm === 1) {
      dago = String(dd).padStart(2, '0');
      mago = '12';
      yago = parseInt(yyyy) - 1;
    } else {
      dago = String(dd).padStart(2, '0');
      mago =  String(parseInt(mm) - 1).padStart(2, '0');
      yago = yyyy;
    }
  }

  const options = {
    method: 'GET',
    url: 'https://apigw1.bot.or.th/bot/public/Stat-ReferenceRate/v2/DAILY_REF_RATE/',
    params: {
      start_period: `${yago}-${mago}-${dago}`,
      end_period: `${pyyyy}-${pmm}-${pdd}`
    },
    headers: {
      'X-IBM-Client-Id': 'df7d057e-4e6d-4da5-bdd9-329df964bd7e',
      'Accept': 'application/json'
    }
  };
  
  return new Promise(async (resolve, reject) => {
    axios(options)
      .then(response => {
        console.log('RateUSDtoTHB response...');
        console.log(response.data);

        resolve(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  });
}
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
async function getConvertUSDtoTHB(dd, mm, yyyy) {
  const currentDate = new Date();

  let pdd, pmm, pyyyy;
  let dago, mago, yago;

  dago = dd;
  mago = mm;
  yago = yyyy;

  pdd = String(currentDate.getDate()).padStart(2, "0");
  pmm = String(currentDate.getMonth()).padStart(2, "0");
  pyyyy = currentDate.getFullYear();

  const options = {
    method: 'GET',
    url: 'https://apigw1.bot.or.th/bot/public/Stat-ReferenceRate/v2/DAILY_REF_RATE/',
    params: {
      start_period: `${yago}-${mago}-${dago}`,
      end_period: `${pyyyy}-${pmm}-${pdd}`
    },
    headers: {
      'X-IBM-Client-Id': 'df7d057e-4e6d-4da5-bdd9-329df964bd7e',
      'Accept': 'application/json'
    }
  };
  
  return new Promise(async (resolve, reject) => {
    axios(options)
      .then(response => {
        console.log('RateUSDtoTHB response...');
        console.log(response.data);

        resolve(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  });
}
// Common functions
async function getHistoricalOilPrices(language, dd, mm, yyyy) {
  const checkDate = new Date();

  const historicalPrices = [];

  if ( dd === checkDate.getDate() 
  && mm === checkDate.getMonth() + 1 
  && yyyy === checkDate.getFullYear() - 1) {
    const currentDate = checkDate;

    const oneYearAgoDate = new Date();
    oneYearAgoDate.setDate(currentDate.getDate());
    oneYearAgoDate.setMonth(currentDate.getMonth());
    oneYearAgoDate.setFullYear(currentDate.getFullYear() - 1);

    for (let date = new Date(oneYearAgoDate); date <= currentDate; date.setDate(date.getDate() + 1)) {
      const dd = date.getDate();
      const mm = date.getMonth() + 1;
      const yyyy = date.getFullYear();
  
      try {
        const oilPrice = await getOilPrice(language, dd, mm, yyyy);
        historicalPrices.push(oilPrice);
      } catch (error) {
        console.error(`Error fetching oil price for ${yyyy}-${mm}-${dd}:`, error);
        // ถ้าเกิดข้อผิดพลาดในการดึงราคาน้ำมันในวันที่นั้น ให้ข้ามไปและดึงวันถัดไป
        continue;
      }
    }

    return historicalPrices;
  } else {
    const currentDate = checkDate;

    const time = new Date();
    time.setDate(dd);
    time.setMonth(mm - 1);
    time.setFullYear(yyyy);

    for (let date = time; date <= currentDate; date.setDate(date.getDate() + 1)) {
      const dd = date.getDate();
      const mm = date.getMonth() + 1;
      const yyyy = date.getFullYear();
  
      try {
        const oilPrice = await getOilPrice(language, dd, mm, yyyy);
        historicalPrices.push(oilPrice);
      } catch (error) {
        console.error(`Error fetching oil price for ${yyyy}-${mm}-${dd}:`, error);
        // ถ้าเกิดข้อผิดพลาดในการดึงราคาน้ำมันในวันที่นั้น ให้ข้ามไปและดึงวันถัดไป
        continue;
      }
    }

    return historicalPrices;
  }
}
async function getHistoricalOilPricesProvincial(language, dd, mm, yyyy, provincial) {
  const checkDate = new Date();

  const historicalPricesProvincial = [];

  if ( dd === checkDate.getDate() 
  && mm === checkDate.getMonth() + 1 
  && yyyy === checkDate.getFullYear() - 1) {
    const currentDate = checkDate;

    const oneYearAgoDate = new Date();
    oneYearAgoDate.setDate(currentDate.getDate());
    oneYearAgoDate.setMonth(currentDate.getMonth());
    oneYearAgoDate.setFullYear(currentDate.getFullYear() - 1);

    for (let date = new Date(oneYearAgoDate); date <= currentDate; date.setDate(date.getDate() + 1)) {
      const dd = date.getDate();
      const mm = date.getMonth() + 1;
      const yyyy = date.getFullYear();
  
      try {
        const oilPriceProvincial = await getOilPriceProvincial(language, dd, mm, yyyy, provincial);
        historicalPricesProvincial.push(oilPriceProvincial);
      } catch (error) {
        console.error(`Error fetching oil price for ${yyyy}-${mm}-${dd}:`, error);
        // ถ้าเกิดข้อผิดพลาดในการดึงราคาน้ำมันในวันที่นั้น ให้ข้ามไปและดึงวันถัดไป
        continue;
      }
    }

    return historicalPricesProvincial;
  } else {
    const currentDate = checkDate;

    const time = new Date();
    time.setDate(dd);
    time.setMonth(mm - 1);
    time.setFullYear(yyyy);

    for (let date = time; date <= currentDate; date.setDate(date.getDate() + 1)) {
      const dd = date.getDate();
      const mm = date.getMonth() + 1;
      const yyyy = date.getFullYear();
  
      try {
        const oilPriceProvincial = await getOilPriceProvincial(language, dd, mm, yyyy, provincial);
        historicalPricesProvincial.push(oilPriceProvincial);
      } catch (error) {
        console.error(`Error fetching oil price for ${yyyy}-${mm}-${dd}:`, error);
        // ถ้าเกิดข้อผิดพลาดในการดึงราคาน้ำมันในวันที่นั้น ให้ข้ามไปและดึงวันถัดไป
        continue;
      }
    }

    return historicalPricesProvincial;
  }
}

// Starting if server running
(async function () {
  await insertSGDOilPrice();
  await insertPTTOilPrice();

  // every day to insert sgd, ptt
  setInterval(insertSGDOilPrice, 60000); 
  setInterval(insertPTTOilPrice, 24 * 60 * 60 * 1000);
})();

async function insertSGDOilPrice() {
  try {
      const data = await getSingaporeOil();
      const oilSgdData = data['OILSGD'];
      console.log(oilSgdData);

      const client = new Client({
          user: 'ford_ser',
          host: '10.161.112.160',
          database: 'oil_price_cloud',
          password: '1q2w3e4r',
          port: 5432,
      });

      await client.connect();

      const query = `
          INSERT INTO sgd_oil_price (oilsgd_value, oilsgd_change, oilsgd_change1, oilsgd_change2, oilsgd_lastdaily, oilsgd_hi, oilsgd_lo, oilsgd_time, oilsgd_chart)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;

      const values = [
          oilSgdData.value,
          oilSgdData.change,
          oilSgdData.change1,
          oilSgdData.change2,
          oilSgdData.lastdaily,
          oilSgdData.hi,
          oilSgdData.lo,
          oilSgdData.time,
          oilSgdData.chart
      ];

      await client.query(query, values);
      await client.end();
      
      console.log("Data inserted sdg successfully");
  } catch (error) {
      console.error('Error fetching and processing data:', error);
  }
}
async function insertPTTOilPrice() {
  try {
      const data = await getCurrentOilPrice('en');
      const parsed = parser.parse(data);
      console.log(parsed);

      const xmlString = parsed['soap:Envelope']['soap:Body'].CurrentOilPriceResponse.CurrentOilPriceResult;
      const dom = new JSDOM(xmlString);
      const document = dom.window.document;
      const fuelElements = document.getElementsByTagName('FUEL');

      const fuelArray = [];
      for (let i = 0; i < fuelElements.length; i++) {
          const fuelElement = fuelElements[i];
          const priceDate = fuelElement.querySelector('PRICE_DATE').textContent;
          const product = fuelElement.querySelector('PRODUCT').textContent;
          const price = fuelElement.querySelector('PRICE').textContent;

          const fuelInfo = {
              "PRICE_DATE": priceDate,
              "PRODUCT": product,
              "PRICE": price
          };

          fuelArray.push(fuelInfo);
      }

      console.log(fuelArray);

      const client = new Client({
          user: 'ford_ser',
          host: '10.161.112.160',
          database: 'oil_price_cloud',
          password: '1q2w3e4r',
          port: 5432,
      });

      await client.connect();

      const queries = fuelArray.map(async (fuelInfo) => {
          const { PRICE_DATE, PRODUCT, PRICE } = fuelInfo;
          const query = `
              INSERT INTO ptt_oil_price (price_date, product, price)
              VALUES ($1, $2, $3)
          `;

          const values = [PRICE_DATE, PRODUCT, PRICE];

          return client.query(query, values);
      });

      await Promise.all(queries);

      await client.end();

      console.log("Data inserted ptt successfully");
  } catch (error) {
      console.error('Error fetching and processing data:', error);
  }
}

