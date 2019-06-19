const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 8000;
const puppeteer = require('puppeteer');
const axios = require('axios');

const app = express();

app.use('/', express.static(path.join(__dirname, '/client/dist')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


app.use(bodyParser.json());


// app.post('*', (req, res) => {
//   let myUrl = req.body.data;
//   axios.post('https://api.apify.com/v2/actor-tasks/2BJyv98bjDgZoqWp8/run-sync?token=rix5szifvkWjgnqsipTaHxqDL&ui=1', {url: myUrl})
//   .then((result) => {
//     res.send(result.data);
//     return result.data;
//   })
//   .catch((err) => {
//     res.status(400).send(err);
//     return err;
//   });
//   // request(mainUrl, res);
// });


app.post('*', (req, res) => {
  let itemUrl = req.body.data;
  if (!itemUrl) {
    itemUrl = 'https://www.amazon.com/Ferro-Aldo-MFA806035-Mid-Top-Lace-Up/dp/B01NCWLJ8G?pf_rd_p=3ebd7bb8-e4db-4762-b094-2aa45768a3b5&pd_rd_wg=v87VZ&pf_rd_r=BVJ1BJK6RHWZTT2AAH79&ref_=pd_gw_cr_cartx&pd_rd_w=DE9qE&pd_rd_r=37fce3d5-d3ea-4d67-b2fd-c46f87610b02';
  }
  async function getInfo(myUrl, res) {
    let price = {};
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']});
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9'
  });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');
    await page.goto(myUrl);
    let selector;
    const amazon = await page.evaluate(() => {
      const descriptions = [];
      const ul = document.querySelector('#feature-bullets > ul');
      const items = ul.getElementsByTagName('li');
      for (let i = 0; i < items.length; i ++) {
        descriptions.push(items[i].innerText);
      }

      let price,
      i = 0,
      foundPrice = false,
      select;
      const priceSelector = ['#priceblock_dealprice', '#priceblock_ourprice', '#price > table > tbody > tr:nth-child(1) > td.a-span12.a-color-secondary.a-size-base > span.priceBlockStrikePriceString.a-text-strike'];

      while (foundPrice === false) {
         select = document.querySelector(priceSelector[i]);
        if (select) {
          price = select.textContent;
          foundPrice = true;
        }
        i++;
      }


      return {
        price,
        item_name: document.getElementById('productTitle').innerText,
        photo: document.getElementById('landingImage').src,
        description: descriptions,
      };
    });
      console.log('selector######: ', selector);
    await browser.close();
    res.send(JSON.stringify(amazon));
  }
  getInfo(itemUrl, res);
});


app.listen(port, (err) => {
  err ? console.log(err) : console.log(`Running on port ${port}`);
});
