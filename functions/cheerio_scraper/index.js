const cheerio = require('cheerio');
const request = require('request');


const scrapeAmazon = (res, url) => {

  async function getData(res, url) {
    var opts = {
      uri: url,
      gzip: true
    };
    request.get(opts, (err, response, data) => {

      if (err) {
        console.log('err: ', err);
        res.status(500).send(err);
      }

      const $ = cheerio.load(data, {ignoreWhiteSpace: true});

      const subStr = url.split('?')[0];
      const id = subStr.substr(subStr.length - 10, subStr.length - 1);

      let price,
      i = 0,
      foundPrice = false,
      onSale = false,
      select;

      const priceSelector = ['#priceblock_dealprice', '#priceblock_ourprice', '#price > table > tbody > tr:nth-child(1) > td.a-span12.a-color-secondary.a-size-base > span.priceBlockStrikePriceString.a-text-strike'];

      while (foundPrice === false) {
        select = $(priceSelector[i]).text();

        if (select) {
          console.log('found price is true');
          price = select.split('$')[1];
          foundPrice = true;
          if (i === 0) {
            onSale = true;
          }
        }
        i++;
      }

      const desc = [];

      $('#feature-bullets > ul > li > span').each((i, el) => {
        const bullet = $(el).text().trim()
        if ((bullet.substr(0, 19) === "Make sure this fits") === false) {
          desc.push(bullet.substr(0, 75));
        }
      })

      const test = $('#landingImage');
      const result = {
        name: $('#title span').text().trim(),
        description: desc,
        price,
        onSale,
        imageUrl: Object.keys(JSON.parse(test[0].attribs['data-a-dynamic-image']))[0],
        url,
        id
    }
      // console.log('################result: ', Object.keys(JSON.parse(test[0].attribs['data-a-dynamic-image']))[0]);

      res.send(result);
    });
  }

  getData(res, url);
}

module.exports = scrapeAmazon;
