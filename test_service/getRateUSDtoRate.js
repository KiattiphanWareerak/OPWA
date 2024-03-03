const request = require('request');

const options = {
  method: 'GET',
  url: 'https://apigw1.bot.or.th/bot/public/Stat-SpotRate/v2/SPOTRATE/',
  qs: {start_period: '2024-03-03', end_period: '2024-03-03'},
  headers: {'X-IBM-Client-Id': 'df7d057e-4e6d-4da5-bdd9-329df964bd7e', accept: 'application/json'}
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);
    console.log(body);
  // แปลง JSON string เป็น JavaScript Object
  const data = JSON.parse(body);

  // แสดงข้อมูลที่ต้องการ
  console.log('Timestamp:', data.result.timestamp);
  console.log('API:', data.result.api);
  console.log('Data Header:', data.result.data.data_header);
  console.log('Data Detail:', data.result.data.data_detail);
});