const puppeteer = require('puppeteer');
const http = require('http');
const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

require('dotenv').config();
const app = require('../../backend/src/app');

let backend;
let frontend;
let browser;
let page;

beforeAll(() => {
  backend = http.createServer(app);
  backend.listen(3010, () => {
    console.log('Backend Running at http://localhost:3010');
  });
  frontend = http.createServer(
    express()
      .use('/v0', createProxyMiddleware({ 
        target: 'http://localhost:3010/',
        changeOrigin: true}))
      .use('/static', express.static(
        path.join(__dirname, '..', '..', 'frontend', 'build', 'static')))
      .get('*', function(req, res) {
        res.sendFile('index.html', 
            {root:  path.join(__dirname, '..', '..', 'frontend', 'build')})
      })
  );
  frontend.listen(3020, () => {
    console.log('Frontend Running at http://localhost:3020');
  });
});

afterAll((done) => {
  backend.close(() => { 
    frontend.close(done);
  });
});

beforeEach(async () => {
  browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--headless',
    ],
  });
  page = await browser.newPage();
});

afterEach(async () => {
  await browser.close();
});


// I WANT TO:
// go to page ---
// grab email text box ---
// grab password text box ---

// type into email: 'molly@books.com' ---
// type into password: 'mollymember' ---

// click login button ---

// await document.query(body).innerText.includes("Inbox") ---

// Do the above query, check for email from maire
// Check for proper subject
// Proper FromName
// Proper content start

// click the logout button

// Do the whole above process for AnnaAdmin

// Logs in and checks mail for Molly
test('Get Mailbox', async () => {
  // go to page
  await page.goto('http://localhost:3020');

  // type into email: 'molly@books.com'
  await page.type('aria/Email Address', 'molly@books.com');
  // type into password: 'mollymember'
  await page.type('aria/Password', 'mollymember');

  // click login button
  await page.click('aria/login button');

  // Check that Inbox is displayed
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Inbox")',
  );

  // Check that theres at least one email from Maire
  // Note: dont check values of received because the display
  // for them changes based on the day that e2e is tested
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Maire Quiambao")',
    'document.querySelector("body").innerText.includes("Extra Emails")',
    'document.querySelector("body").innerText.includes("For Date Tests")',
  );

  await page.click('aria/logout');

  // back at login page?
  // type into email: 'molly@books.com'
  await page.type('aria/Email Address', 'molly@books.com');
  // type into password: 'mollymember'
  await page.type('aria/Password', 'mollymember');
});

// Logs in as Anna and checks for different mails
test('Get Annas Mailbox', async () => {
  // go to page
  await page.goto('http://localhost:3020');

  // type into email: 'molly@books.com'
  await page.type('aria/Email Address', 'anna@books.com');
  // type into password: 'mollymember'
  await page.type('aria/Password', 'annaadmin');

  // click login button
  await page.click('aria/login button');

  // Check that Inbox is displayed
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Inbox")',
  );

  // Check that theres at least one email from Anna
  // Note: dont check values of received because the display
  // for them changes based on the day that e2e is tested
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Arman Jordan")',
    'document.querySelector("body").innerText.includes("My Email to Anna")',
    'document.querySelector("body").innerText.includes("Blah Blah content")',
  );

  await page.click('aria/logout');

  // back at login page?
  // type into email: 'anna@books.com'
  await page.type('aria/Email Address', 'anna@books.com');
  // type into password: 'annaadmin'
  await page.type('aria/Password', 'annamember');
});
