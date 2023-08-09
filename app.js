const express = require('express');
const compile = require('./main');
const multer = require('multer');
const cors = require('cors');
const puppeteer = require('puppeteer');
const fs = require('fs');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const fileBuffer = req.file.buffer;

  const html = await compile(fileBuffer);

  // CONVERT TO PDF
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.setContent(html);

  // Generate PDF as a buffer
  const pdfBuffer = await page.pdf({ format: 'A4' });

  await browser.close();

  res.send(pdfBuffer);
});

app.listen(3002, () => {
  console.log('Example app listening on port 3002!');
});
