// Require module
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { XMLParser } = require('fast-xml-parser');

// Endpoint the PTT service
const serviceURL = 'https://orapiweb.pttor.com/oilservice/OilPrice.asmx';

// Set up the server
const app = express();
const port = 3002;
const host = 'localhost';
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
      req.query.provincial || 'bangkok'
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
    const data = await getOilPrice(
      req.query.language || 'en',
      req.query.dd,
      req.query.mm,
      req.query.yyyy,
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
    const data = await getHistoricalOilPricesProvincial(
      req.query.language || 'en',
      req.query.dd,
      req.query.mm,
      req.query.yyyy,
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
