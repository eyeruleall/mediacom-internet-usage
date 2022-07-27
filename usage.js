require("dotenv").config();
const puppeteer = require("puppeteer");

if (!process.env.MEDIACOM_USER || !process.env.MEDIACOM_PASS)
  throw new Error("Mediacom User ID and Password must be set");

const username = process.env.MEDIACOM_USER;
const password = process.env.MEDIACOM_PASS;

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);

    await Promise.all([
      await page.goto("https://support.mediacomcable.com"),
      await page.waitForSelector("button[ng-click='GoToSSO()']"),
    ]);

    await Promise.all([
      await page.hover("button[ng-click='GoToSSO()']"),
      await page.click("button[ng-click='GoToSSO()']"),
      await page.waitForSelector('input[name="pf.username"]'),
      await page.waitForSelector('input[name="pf.pass"]'),
      await page.waitForSelector("#btnSignIn"),
    ]);

    await Promise.all([
      await page.type('input[name="pf.username"]', username),
      await page.type('input[name="pf.pass"]', password),
      await page.click("#btnSignIn"),
      await page.waitForSelector(
        "internet-usage-circle > div:nth-child(1) > div > div > div > span"
      ),
    ]);

    const total = await page.evaluate(() =>
      document.querySelector("internet-usage-circle").getAttribute("used")
    );
    const allowed = await page.evaluate(() =>
      document.querySelector("internet-usage-circle").getAttribute("total")
    );

    const percent = await page.evaluate(
      () =>
        document.querySelector(
          "internet-usage-circle > div:nth-child(1) > div > div > div > span"
        ).innerHTML
    );

    const updown = await page.evaluate(() =>
      document.querySelector("internet-usage-circle").getAttribute("updown")
    );
    const updownData = JSON.parse(updown);

    const download = updownData.TotalDnOctetsTxt;
    const upload = updownData.TotalUpOctetsTxt;

    await browser.close();

    const response = `{
  percent: ${parseInt(percent)},
  allowed: ${parseInt(allowed)},
  upload: ${parseInt(upload)},
  download: ${parseInt(download)},
  total: ${parseInt(total)},
}`;
    console.log(response);
  } catch (error) {
    console.error(error);
  }
})();
