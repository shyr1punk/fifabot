// @ts-check

const { request } = require('https');

const headers = {
  'Host': 'tickets.fifa.com',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:61.0) Gecko/20100101 Firefox/61.0',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
  'Referer': 'https://tickets.fifa.com/Services/ADService.html?lang=en',
  'Connection': 'keep-alive'
};

const HOST = 'tickets.fifa.com';
const API_URL = '/API/WCachedL1/en/BasicCodes/GetBasicCodesAvailavilityDemmand?currencyId=USD';

const options = {
  host: HOST,
  path: API_URL,
  port: 443,
  method: 'GET',
  headers
};

let result = '';

let data;
module.exports = new Promise((resolve, reject) => {
  const req = request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (d) => {
      result += d;
    });
    res.on('end', () => {
      try {
        data = JSON.parse(result);
      } catch (err) {
        console.error(err);
      }
      const matches = data.Data.PRODUCTIMT.filter(product =>
        product.MatchStadium === 5 ||
        product.MatchStadium === 2
      ).map(match => ({
        ...match,
        Availability: data.Data.Availability.find(avail =>
          avail.p === match.ProductId
        ).a
      })).filter(match => match.Availability);
      console.log('Cached on: ' + new Date(data.CachedOn))
      console.log(matches);
      resolve(matches);
    })
  });

  req.on('error', (e) => {
    console.error(e);
    reject(e);
  });
  req.end();
})
