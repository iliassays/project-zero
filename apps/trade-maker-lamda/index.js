import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export const handler = async (
  event,
  context
) => {
  try {

    const browser = await puppeteer.launch({
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
      defaultViewport: chromium.defaultViewport,
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    });
    const page = await browser.newPage();

    await page.goto("https://developers.google.com/web/");

    await page.screenshot({
      path: "/tmp/screenshot.jpg",
      fullPage: true,
    });
    await browser.close();
 } catch(err) {
     console.log("Some error happended: ", err);
 }
}