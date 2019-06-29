const functions = require('firebase-functions');
// const puppeteer = require('puppeteer');
const cors = require("cors")
const express = require("express")
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const cheerioScraper = require('./cheerio_scraper/index.js');

app.use(cors({origin: true}));
app.use(bodyParser.urlencoded({ extended: false }));

app.post('*', (req, res) => {
  let itemUrl = req.body.data;
  if (!itemUrl) {
    res.status(400).send('No url detected');
    return;
  }
  const subStr = itemUrl.split('?');
  const checkForAmazon = itemUrl.split('/')[2];
if (subStr[1].length <= 1 || checkForAmazon !== 'www.amazon.com') {
  res.status(400).send('Invalid url. check for incomplete url string or not an amazon product url');
  return;
}
  cheerioScraper(res, itemUrl);
});

const myApp = app;

exports.scraper = functions.https.onRequest(myApp);

exports.helloWorld = functions.https.onRequest(myApp);
