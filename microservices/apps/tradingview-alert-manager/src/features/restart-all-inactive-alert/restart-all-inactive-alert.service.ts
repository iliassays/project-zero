import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok } from 'oxide.ts';
import { RestartAllInactiveAlertCommand } from './restart-all-inactive-alert.command';
import { Logger, Inject } from '@nestjs/common';
import { AggregateId } from 'libs/ddd/aggregate-id';
import { TradingviewService } from '../../tradingview-actions/tradingview.service';
import { Browser, Page } from 'puppeteer';
import tradingviewConfig from '../../configs/tradingview.config';
import { ConfigType } from '@nestjs/config';

@CommandHandler(RestartAllInactiveAlertCommand)
export class RestartAllInactiveAlertService
  implements ICommandHandler<RestartAllInactiveAlertCommand>
{
  constructor(
    private readonly logger: Logger,
    @Inject(tradingviewConfig.KEY)
    private tvConfig: ConfigType<typeof tradingviewConfig>,
    private readonly tradingviewService: TradingviewService,
  ) {
    this.logger.log('Initiated', RestartAllInactiveAlertCommand.name);
  }

  async execute(
    command: RestartAllInactiveAlertCommand,
  ): Promise<Result<AggregateId, Error>> {
    let browser: Browser;

    try {
      const headless = true;

      let page: Page;
      let accessDenied: boolean;

      browser = await this.tradingviewService.launchBrowser(
        headless,
        `${this.tvConfig.url}#signin`,
      );

      if (headless) {
        page = await browser.newPage();

        const pageResponse = await page.goto(this.tvConfig.url, {
          waitUntil: 'domcontentloaded',
        });

        await this.tradingviewService.waitForTimeout(8);

        accessDenied = pageResponse.status() === 403;
      } else {
        page = (await browser.pages())[0];

        await this.tradingviewService.waitForTimeout(5);

        accessDenied = await page.evaluate(() => {
          return document.title.includes('Denied');
        });
      }

      if (accessDenied) {
        if (this.tvConfig.username && this.tvConfig.password) {
          this.logger.log('Heading towards login');

          await this.tradingviewService.login(
            page,
            this.tvConfig.username,
            this.tvConfig.password,
          );

          await page.waitForSelector('.widgetbar-pages');

          this.logger.log('Right toolbar loaded');
        } else {
          this.logger.warn(
            "You'll need to sign into TradingView in this browser (one time only)\n...after signing in, press ctrl-c to kill this script, then run it again",
          );

          await this.tradingviewService.waitForTimeout(1000000);
          await browser.close();

          process.exit(1);
        }
      }

      await this.tradingviewService.waitForTimeout(5);
      await this.tradingviewService.restartAllInactiveAlert(page);

      await this.tradingviewService.waitForTimeout(5);
      this.logger.log('Closing browser');
      await browser.close();

      return Ok(command.aggregateId);
    } catch (error: any) {
      await browser.close();
      //Handle domain spacific error and return Err(new DomainSpecificError(error));

      throw error;
    }
  }
}