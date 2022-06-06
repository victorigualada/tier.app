import config from 'config';
import { Response as ExpressResponse } from 'express';
import { Body, Controller, Get, Params, Post, Response } from '@decorators/express';
import { UrlBody } from '../interfaces/url-body';
import { UrlService } from '../service/url.service';
import { Logger } from '../../shared/logger';

@Controller('/')
export class UrlController {
  private readonly logger: Logger;
  private readonly baseUrl: string;

  constructor(private readonly userService: UrlService) {
    this.logger = new Logger(this.constructor.name);
    this.baseUrl = config.get('baseUrl');
  }

  @Get('/:short')
  async getUrl(@Response() res: ExpressResponse, @Params('short') short: string) {
    const url = `https://${this.baseUrl}/${short}`;
    this.validateUrl(url);
    try {
      const url = await this.userService.getUrl(short);
      if (url) {
        res.redirect(url);
        this.logger.info(`Found URL ${url} for ${short}`);
      } else {
        res.status(404).send('Not found');
        this.logger.info(`URL Not found ${short}`);
      }
    } catch (error) {
      res.status(500).send('Server Error');
      this.logger.error(error);
    }
  }

  @Post('/shorten')
  async shortenUrl(@Body() body: UrlBody, @Response() res: ExpressResponse) {
    this.validateUrl(body.url);
    try {
      const shortUrl = await this.userService.shortenUrl(body.url);
      this.logger.info(`Returning shortened url: ${shortUrl} for ${body.url}`);
      res.send(new URL(`/${shortUrl}`, `https://${this.baseUrl}`));
    } catch (error) {
      res.status(500).send('Server Error');
      this.logger.error(error);
    }
  }

  private validateUrl(url: string) {
    try {
      new URL(url);
    } catch (e) {
      this.logger.error(`Refusing to shorten invalid url: ${url}`);
      throw new Error('Invalid URL');
    }
  }
}
