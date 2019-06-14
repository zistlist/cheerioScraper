const functions = require('firebase-functions');
const puppeteer = require('puppeteer');
const cors = require("cors")
const express = require("express")
const app = express();
const bodyParser = require('body-parser');

app.use(cors({origin: true}));
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/test', (req, res) => {
  async function getInfo(myUrl, res) {
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9'
  });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');
    await page.goto(myUrl);
    // const amazon = await page.evaluate(() => {
    //     return {
    //       price: document.getElementById('priceblock_ourprice').textContent,
    //       product: document.getElementById('productTitle').textContent,
    //     };
    // });
    await browser.close();
    res.send(JSON.stringify(amazon));
  }
  getInfo('https://www.nike.com/', res);
});

app.get('*', (req ,res) => {
  async function getPic(myUrl, res) {
    let price = {};
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']});
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9'
  });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');
    await page.goto(myUrl);
    // const amazon = await page.evaluate(() => {
    //     return {
    //       price: document.getElementById('priceblock_ourprice').textContent,
    //       product: document.getElementById('productTitle').textContent,
    //     };
    // });
    await browser.close();
    res.send('hello from scraper not jamming');
  }
  getPic('https://www.nike.com/', res);
});

app.post('*', (req, res) => {
  // let mainUrl;
  // if (req.body.data) {
  //  mainUrl = req.body.data;
  // } else {
  //   res.send('req.body.data is undefined. Please submit a valid URL.');
  // }
  // async function getPic(myUrl, res) {
  //   let price = {};
  //   const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
  //   const page = await browser.newPage();
  //   await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
  //   await page.goto(myUrl);
  //   const amazon = await page.evaluate(() => {
  //       return {
  //         price: document.getElementById('priceblock_ourprice').textContent,
  //         product: document.getElementById('productTitle').textContent,
  //       };
  //   });
  //   await browser.close();
  //   res.send(JSON.stringify(amazon));
  // }
  // getPic(mainUrl, res);
  res.send('hello from scraper');
});

const myApp = app;


exports.scraper = functions.https.onRequest(myApp);

exports.helloWorld = functions.https.onRequest(myApp);
