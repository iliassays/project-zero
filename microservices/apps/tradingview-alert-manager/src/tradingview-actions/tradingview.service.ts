import { Injectable, Logger } from '@nestjs/common';
import puppeteer, { Browser, Page, executablePath } from 'puppeteer';
import { accessSync, constants } from 'fs';
import { mkdir } from 'fs/promises';
import { join } from 'path';
@Injectable()
export class TradingviewService {
  constructor(private readonly logger: Logger) {
    logger.log(`TradingviewService initiated`);
  }

  doXpath = async (page, selector: string) => {
    const response = await page.evaluate((sel) => {
      const el = document.evaluate(
        sel,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue as HTMLElement;

      return !!el;
    }, selector);
    return response;
  };

  isXpathVisible = async (page, selector: string) => {
    this.logger.log(`...isXpathVisible?: ${selector}`);
    // const elements = await page.$x(selector)
    // const visible = elements.length > 0
    const visible = await this.doXpath(page, selector);
    this.logger.log(`..isXpathVisible: ${visible}`);

    return visible;
  };

  fetchFirstXPath = async (page, selector: string, timeout = 20000) => {
    this.logger.log(`...selector: ${selector}`);
    try {
      await page.waitForXPath(selector, { timeout });
    } catch (e) {
      throw e;
    }
    const elements = await page.$x(selector);

    return elements[0];
  };

  launchBrowser = async (headless: boolean, url?: string): Promise<Browser> => {
    const userDataDir = join(process.cwd(), 'user_data'); // where chrome will store it's stuff

    try {
      accessSync(userDataDir, constants.W_OK);
    } catch {
      this.logger.log(
        `Attempting to create directory for Chrome user data userDataDir}`,
      );

      await mkdir(userDataDir);
    }

    this.logger.log(`Launching browser.....`);
    return await puppeteer.launch({
      executablePath: executablePath(),
      headless: headless ? 'new' : false,
      userDataDir,
      defaultViewport: {
        width: 1920,
        height: 1080,
        isMobile: false,
        hasTouch: false,
      },
      args: [
        '--no-sandbox',
        '--enable-experimental-web-platform-features', // adds support for :has selector in styleOverrides. In theory its not experimental in chrome 105
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        // '--single-process', // will cause it to die
        '--disable-gpu',
        headless ? '--headless' : '',
        headless && !url ? '' : `--app=${url}`,
        '--window-size=1920,1080', // otherwise headless doesn't work
        // '--incognito'
      ],
    });
  };

  login = async (page: Page, username: string, pass: string) => {
    try {
      const emailSignInButton = await this.fetchFirstXPath(
        page,
        `//button[contains(@name, 'Email')]`,
        5000,
      );
      emailSignInButton.click();
      await this.waitForTimeout(1);
    } catch (e) {
      this.logger.warn('no email toggle button showing!');

      // const loginLink = await this.fetchFirstXPath(
      //   page,
      //   `//a[contains(@class, 'js-login-link"')]`,
      //   5000,
      // );
      // loginLink.click();
      // await this.waitForTimeout(1);
    }

    const usernameInput = await this.fetchFirstXPath(
      page,
      "//input[@name='id_username']",
    );
    await usernameInput.type(`${username}`);
    const passwordInput = await this.fetchFirstXPath(
      page,
      "//input[@name='id_password']",
    );
    this.logger.log('typing password');
    await passwordInput.type(pass);

    await page.waitForSelector('.content-D4RPB3ZC > span');
    await page.click('.content-D4RPB3ZC > span');

    this.logger.log('submit button clicked');
    await this.waitForTimeout(1);
  };

  restartAllInactiveAlert = async (page) => {
    try {
      const isNotShowingAlertPanel = async () => {
        return !(await this.isXpathVisible(
          page,
          "//div[contains(@class, 'widgetbar-pages') and not(contains(@class, 'hidden'))]",
        ));
      };

      if (await isNotShowingAlertPanel()) {
        this.logger.warn('Not showing any alert panel');

        const alertPanelOpenerButton = await this.fetchFirstXPath(
          page,
          `//button[contains(@data-name, 'alerts')]`,
          5000,
        );
        alertPanelOpenerButton.click();
        await this.waitForTimeout(2);

        if (await !isNotShowingAlertPanel()) {
          this.logger.log('Alert Pannel is showing');
        }
      }
    } catch (e) {
      this.logger.warn('No alert pannel openner button showing!');
    }

    await this.waitForTimeout(4);
    this.logger.log('Alert pannel opened...');

    const alertPanelOpenerButton = await this.fetchFirstXPath(
      page,
      `//div[contains(@data-name, 'alerts-settings-button')]`,
      5000,
    );
    alertPanelOpenerButton.click();
    await this.waitForTimeout(0.5);

    const restartAllInactiveMenuButton = await this.fetchFirstXPath(
      page,
      `//span[contains(@class, 'labelRow-jFqVJoPk')]`,
      5000,
    );

    if (restartAllInactiveMenuButton) {
      this.logger.log('restartAllInactiveMenuButton found...');
      await restartAllInactiveMenuButton.click();
      await this.waitForTimeout(0.5);
    }

    const restartAllInactivePopupYesButton = await this.fetchFirstXPath(
      page,
      `//button[contains(@class, 'actionButton-k53vexPa')]`,
      5000,
    );

    if (restartAllInactivePopupYesButton) {
      this.logger.log('restartAllInactivePopupYesButton found...');
      await restartAllInactivePopupYesButton.click();
      await this.waitForTimeout(0.5);
    }
  };

  logout = async (page) => {
    /* istanbul ignore next */
    await page.evaluate(() => {
      fetch('/accounts/logout/', {
        method: 'POST',
        headers: { accept: 'html' },
        credentials: 'same-origin',
      }).then(() => {
        this.logger.log(`Logged out of TradingView`);
      });
    });

    await page.reload({
      waitUntil: 'networkidle2',
    });
  };

  waitForTimeout = (millsOrMultplier: number): Promise<void> => {
    let waitTime = millsOrMultplier;

    if (millsOrMultplier < 20) {
      waitTime = Math.round(((1000 * millsOrMultplier) / 1000) * 1000);
    }

    return new Promise((resolve) => {
      setTimeout(resolve, waitTime);
    });
  };
}
