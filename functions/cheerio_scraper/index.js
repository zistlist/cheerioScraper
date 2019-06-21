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
      }

      const $ = cheerio.load(data, {ignoreWhiteSpace: true});

      let price,
      i = 0,
      foundPrice = false,
      onSale = false,
      select;
      const priceSelector = ['#priceblock_dealprice', '#priceblock_ourprice', '#price > table > tbody > tr:nth-child(1) > td.a-span12.a-color-secondary.a-size-base > span.priceBlockStrikePriceString.a-text-strike'];
      while (foundPrice === false) {
        select = $(priceSelector[i]).text();
        if (select) {
          price = select;
          foundPrice = true;
          if (i === 0) {
            onSale = true;
          }
        }
        i++;
      }

      const desc = [];

      $('#feature-bullets > ul > li > span').each((i, el) => {
        console.log('looking for div');
        desc.push($(el).text().trim());
      })

      const test = $('#landingImage');
      const result = {
        item_name: $('#title span').text().trim(),
        description: desc,
        price,
        onSale,
        photo: Object.keys(JSON.parse(test[0].attribs['data-a-dynamic-image']))[0],
    }
      // console.log('################result: ', Object.keys(JSON.parse(test[0].attribs['data-a-dynamic-image']))[0]);

      res.send(result);
    });
  }


  getData(res, url);
}

module.exports = scrapeAmazon;
