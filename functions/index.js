const functions = require('firebase-functions');
const puppeteer = require('puppeteer');
const cors = require("cors")
const express = require("express")
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');

app.use(cors({origin: true}));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('*', (req ,res) => {
  async function getInfo(myUrl, res) {
    let price = {};
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']});
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9'
  });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');
    await page.goto(myUrl);
    const amazon = await page.evaluate(() => {
        return {
          price: document.getElementById('priceblock_ourprice').textContent,
          product: document.getElementById('productTitle').textContent,
        };
    });
    await browser.close();
    res.send(JSON.stringify(amazon));
  }
  getInfo('https://www.amazon.com/Ferro-Aldo-MFA806035-Mid-Top-Lace-Up/dp/B01NCWLJ8G?pf_rd_p=3ebd7bb8-e4db-4762-b094-2aa45768a3b5&pd_rd_wg=v87VZ&pf_rd_r=BVJ1BJK6RHWZTT2AAH79&ref_=pd_gw_cr_cartx&pd_rd_w=DE9qE&pd_rd_r=37fce3d5-d3ea-4d67-b2fd-c46f87610b02', res);
});

// app.post('*', (req, res) => {
//   let itemUrl = req.body.data;
//   if (!itemUrl) {
//     itemUrl = 'https://www.amazon.com/Ferro-Aldo-MFA806035-Mid-Top-Lace-Up/dp/B01NCWLJ8G?pf_rd_p=3ebd7bb8-e4db-4762-b094-2aa45768a3b5&pd_rd_wg=v87VZ&pf_rd_r=BVJ1BJK6RHWZTT2AAH79&ref_=pd_gw_cr_cartx&pd_rd_w=DE9qE&pd_rd_r=37fce3d5-d3ea-4d67-b2fd-c46f87610b02';
//   }
//   async function getInfo(myUrl, res) {
//     let price = {};
//     const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']});
//     const page = await browser.newPage();
//     await page.setExtraHTTPHeaders({
//       'Accept-Language': 'en-US,en;q=0.9'
//   });
//   await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');
//     await page.goto(myUrl);
//     const amazon = await page.evaluate(() => {
//       const descriptions = [];
//       const ul = document.querySelector('#feature-bullets > ul');
//       const items = ul.getElementsByTagName('li');
//       for (let i = 0; i < items.length; i ++) {
//         descriptions.push(items[i].innerText);
//       }
//
//       return {
//         price: document.getElementById('priceblock_ourprice').textContent,
//         item_name: document.getElementById('productTitle').innerText,
//         photo: document.getElementById('landingImage').src,
//         description: descriptions,
//       };
//     });
//     await browser.close();
//     res.send(JSON.stringify(amazon));
//   }
//   getInfo(itemUrl, res);
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
      onSale = false,
      select;
      const priceSelector = ['#priceblock_dealprice', '#priceblock_ourprice', '#price > table > tbody > tr:nth-child(1) > td.a-span12.a-color-secondary.a-size-base > span.priceBlockStrikePriceString.a-text-strike'];

      while (foundPrice === false) {
         select = document.querySelector(priceSelector[i]);
        if (select) {
          price = select.textContent;
          foundPrice = true;
          if (i === 0) {
            onSale = true;
          }
        }
        i++;
      }


      return {
        onSale,
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



const myApp = app;


exports.scraper = functions.https.onRequest(myApp);

exports.helloWorld = functions.https.onRequest(myApp);
