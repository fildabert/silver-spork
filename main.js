const fs = require('fs');
const handlebars = require('handlebars');
handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});
const XLSX = require('xlsx');
const nodeXlsx = require('node-xlsx');

async function compile(excelBlob) {
  const template = fs.readFileSync('./template.html', 'utf-8');

  const workbook = XLSX.read(excelBlob);
  XLSX.writeFile(workbook, './test.csv', { bookType: 'csv' });
  const csvData = fs.readFileSync('./test.csv', 'utf-8');
  let csvRows = csvData.split('\n');
  csvRows = csvRows.filter((row) => row.length > 21);
  const csvHeaders = [];
  const csvHeader1 = csvRows[0].split(',');
  const csvHeader2 = csvRows[1].split(',');

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let alphabetIndex = 0;
  for (let i = 4; i < csvHeader1.length; i++) {
    const headerObj = {
      no: alphabet[alphabetIndex],
      title: '',
      items: [],
      total: null,
    };
    if (csvHeader1[i] === '') {
      csvHeaders[csvHeaders.length - 1].items.push({
        itemName: csvHeader2[i],
        itemValue: null,
      });
    } else {
      headerObj.title = csvHeader1[i];
      if (csvHeader2[i] !== '') {
        headerObj.items.push({
          itemName: csvHeader2[i],
          itemValue: null,
        });
      }
      csvHeaders.push(headerObj);
      alphabetIndex++;
    }
  }

  const csvValues = csvRows.slice(2);

  const dataResult = [];
  for (let i = 0; i < csvValues.length; i++) {
    const firstFourRows = csvValues[i].split(',').slice(0, 4);
    const row = csvValues[i].split(',').slice(4);
    const objResult = {
      paymentDate: firstFourRows[0],
      name: firstFourRows[1],
      branch: firstFourRows[2],
      no: firstFourRows[3],
      Invoices: [],
    };
    let rowIncrement = 0;
    for (let j = 0; j < csvHeaders.length; j++) {
      const obj = { ...csvHeaders[j] };

      if (obj.items.length === 0) {
        let totalz = Number(row[rowIncrement]) || row[rowIncrement];
        obj.total = totalz.toLocaleString();
      } else {
        let sum = 0;
        obj.items.forEach((item, index) => {
          let totalz = Number(row[rowIncrement]) || row[rowIncrement];
          item.itemValue = totalz.toLocaleString() || 0;
          sum += totalz;
          if (obj.items.length > 1) {
            rowIncrement++;
          }
        });
        obj.total = sum.toLocaleString();
      }
      if (obj.items.length <= 1) {
        rowIncrement++;
      }
      objResult.Invoices.push(obj);
    }
    dataResult.push(objResult);
  }

  // fs.writeFileSync('./data.json', JSON.stringify(dataResult), 'utf-8');

  const compileTemplate = handlebars.compile(template);

  const result = compileTemplate(dataResult[0]);

  return result;
  // fs.writeFileSync('./index.html', result, 'utf-8');
}

module.exports = compile;
