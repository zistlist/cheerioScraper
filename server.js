const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const crawler = require('./scraper.js');
const port = 8000;
const puppeteer = require('puppeteer');

const app = express();

app.use('/', express.static(path.join(__dirname, '/client/dist')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


app.use(bodyParser.json());


app.post('*', (req, res) => {
  let mainUrl;
  if (req.body.data) {
   mainUrl = req.body.data;
  } else {
    res.send('req.body.data is undefined. Please submit a valid URL.');
  }
  async function getPic(myUrl, res) {
    let price = {};
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto(`${myUrl}`);
    const amazon = await page.evaluate(() => {

        return {
          price: document.getElementById('priceblock_ourprice').textContent,
          product: document.getElementById('productTitle').textContent,
        };

    });
    await browser.close();
    res.send(JSON.stringify(amazon));
  }
  getPic(mainUrl, res);
});


app.listen(port, (err) => {
  err ? console.log(err) : console.log(`Running on port ${port}`);
});
