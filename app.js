const express = require('express');
const compile = require('./main');
const multer = require('multer');
const cors = require('cors');
const puppeteer = require('puppeteer');
const jszip = require('jszip');
const fs = require('fs');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const upload = multer({ storage: multer.memoryStorage() });

app.get('/template', async (req, res) => {
  const template = fs.readFileSync('./Template-PDF.xlsx');
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader('Content-Disposition', 'attachment; filename=example.xlsx');

  res.send(template);
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileBuffer = req.file.buffer;

    const results = await compile(fileBuffer);
    // CONVERT TO PDF
    const browser = await puppeteer.launch({
      headless: 'new',
      pipe: true,
      dumpio: true,
      // executablePath: '/usr/bin/chromium',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--no-zygote',
        '--disable-gpu',
        '--disable-audio-output',
        '--headless',
        '--single-process',
      ],
    });
    console.log('WER 1');
    const pdfFiles = [];
    for (let i = 0; i < results.length; i++) {
      const page = await browser.newPage();
      const { name, html } = results[i];
      await page.setContent(html);
      const cssContent = fs.readFileSync('./output.css', 'utf-8');
      await page.evaluate((cssContent) => {
        const style = document.createElement('style');
        style.textContent = cssContent;
        document.head.appendChild(style);
      }, cssContent);
      const pdfBuffer = await page.pdf({ format: 'A4' });

      pdfFiles.push({
        name,
        buffer: pdfBuffer,
      });
    }
    console.log('WER 2');

    await browser.close();
    console.log('-a--a-a');
    const zip = new jszip();

    console.log('WE3');

    for (let i = 0; i < pdfFiles.length; i++) {
      const { name, buffer } = pdfFiles[i];
      zip.file(name + '.pdf', buffer);
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=pdfs.zip');

    res.status(200).send(zipBuffer);
  } catch (error) {
    res.setHeader('Content-Type', 'application/json');
    console.log(error);
    if (error.code) {
      res.status(error.code).send({ error: error.message });
    } else {
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }
});

app.listen(3002, () => {
  console.log('Example app listening on port 3002!');
});
