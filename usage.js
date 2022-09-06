require("dotenv").config();
const axios = require("axios").default;

if (!process.env.ACCOUNT_NUMBER || !process.env.ZIP_CODE)
  throw new Error("Mediacom Account Number and Zip Code must be set");

const accountNumber = process.env.ACCOUNT_NUMBER;
const zipCode = process.env.ZIP_CODE;

async function start() {
  const response = await axios.postForm(
    "https://mediacom.openvault.us/csr/accountQuery.action",
    {
      accountNumber,
      zipCode,
      x: 26,
      y: 16,
    }
  );

  const webpage = response.data.toString();

  const percentLine = webpage.match(/<span class="subTitleRed">\d*%/)[0];
  const percent = percentLine.substring(26, percentLine.indexOf("%"));

  const allowedLine = webpage.match(/max: \d+,/)[0];
  const allowed = allowedLine.substring(5, allowedLine.indexOf(","));

  const uploadLine = webpage.match(
    /usageCurrentUpData\.push\([1-9]\d*(\.\d+)?\)/
  )[0];
  const upload = uploadLine.substring(24, uploadLine.indexOf(")"));

  const downloadLine = webpage.match(
    /usageCurrentDnData\.push\([1-9]\d*(\.\d+)?\)/
  )[0];
  const download = downloadLine.substring(24, downloadLine.indexOf(")"));

  const totalLine = webpage.match(
    /usageCurrentData\.push\([1-9]\d*(\.\d+)?\)/
  )[0];
  const total = totalLine.substring(22, totalLine.indexOf(")"));

  const result = `{
  percent: ${parseInt(percent)},
  allowed: ${parseInt(allowed)},
  upload: ${parseFloat(upload)},
  download: ${parseFloat(download)},
  total: ${parseFloat(total)},
}`;
  console.log(result);
}

start();
