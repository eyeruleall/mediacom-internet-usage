require("dotenv").config();
const puppeteer = require("puppeteer");

if (!process.env.MEDIACOM_USER || !process.env.MEDIACOM_PASS)
  throw new Error("Mediacom User ID and Password must be set");

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.goto("https://support.mediacomcable.com/#!/Log/In", {
      waitUntil: ["load", "domcontentloaded"],
    });

    await Promise.all([
      page.waitForNavigation({ waitUntil: ["load", "domcontentloaded"] }),
      page.waitForSelector('input[name="pf.username"]'),
      page.waitForSelector('input[name="pf.pass"]'),
      page.waitForSelector("#btnSignIn"),
      page.click("login-form > div > div > div > div:nth-child(1) > button"),
    ]);

    await Promise.all([
      await page.type('input[name="pf.pass"]', process.env.MEDIACOM_PASS),
      await page.type('input[name="pf.username"]', process.env.MEDIACOM_USER),
    ]);

    await Promise.all([
      page.click("#btnSignIn"),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);

    const percent = await page.evaluate(
      () =>
        document
          .querySelector(
            "internet-usage-circle > div:nth-child(1) > div > div > div > span"
          )
          .innerHTML.split("%")[0]
    );
    const total = await page.evaluate(
      () =>
        document
          .querySelector(
            "internet-usage-circle > div:nth-child(1) > div > div > div > div:nth-child(2)"
          )
          .innerHTML.split(" GB Total")[0]
    );
    const download = await page.evaluate(
      () =>
        document
          .querySelector(
            "internet-usage-circle > div:nth-child(1) > div > div > div > div:nth-child(3) > label:nth-child(1)"
          )
          .innerHTML.split(" GB Down ")[0]
    );
    const upload = await page.evaluate(
      () =>
        document
          .querySelector(
            "internet-usage-circle > div:nth-child(1) > div > div > div > div:nth-child(3) > label:nth-child(2)"
          )
          .innerHTML.split(" GB Up")[0]
    );
    const allowed = await page.evaluate(
      () =>
        document
          .querySelector(
            "network-usagecomponent > div > div > div.tile.white.padded > div.body > div:nth-child(2) > label.lblSmall"
          )
          .innerHTML.split(" GB ")[1]
          .split("of ")[1]
    );

    await browser.close();

    const response = {
      percent: parseInt(percent),
      allowed: parseInt(allowed),
      upload: parseInt(upload),
      download: parseInt(download),
      total: parseInt(total),
    };
    console.log(response);
  } catch (error) {
    console.error(error);
  }
})();
