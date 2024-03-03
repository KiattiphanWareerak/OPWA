const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');

const serviceURL = 'https://orapiweb.pttor.com/oilservice/OilPrice.asmx';

async function getCurrentOilPrice(language = 'en') {
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

  try {
    const response = await axios.post(serviceURL, body, { headers });
    const data = response.data;

    console.log('response...');
    console.log(data);

    // const parser = new XMLParser();
    // const parsedData = parser.parse(data);
    // console.log(parsedData['soap:Envelope']['soap:Body']['CurrentOilPriceResponse']['CurrentOilPriceResult']);
  } catch (error) {
    console.error('Error fetching oil price:', error);
  }
}

getCurrentOilPrice();
