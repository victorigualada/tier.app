import { attachControllerInstances } from '@decorators/express/lib/src/express';
import express from 'express';
import config from 'config';
import bodyParser from 'body-parser';
import mysql, { Connection } from 'mysql2';
import { UrlController } from './url/controller/url.controller';
import { Logger } from './shared/logger';
import { UrlRepository } from './url/repository/url.repository';
import { UrlService } from './url/service/url.service';

export class App {
  private readonly logger: Logger;
  private readonly app: express.Application;
  private readonly port: number;
  private connection: Connection;

  constructor() {
    this.logger = new Logger(this.constructor.name);
    this.app = express();
    this.port = config.get('port');
  }

  configureMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // CORS
    this.app.use((_req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
      res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization');
      next();
    });
  }

  connect(): void {
    const mysqlConfig = config.get('mysql');
    this.connection = mysql.createConnection(mysqlConfig);
    this.logger.info('Connected to MySQL');
  }

  instantiateProviders(): void {
    const urlRepository = new UrlRepository(this.connection);
    const urlService = new UrlService(urlRepository);
    const urlController = new UrlController(urlService);
    attachControllerInstances(this.app, [urlController]);
  }

  async start(): Promise<void> {
    await this.connect();
    this.configureMiddleware();
    this.instantiateProviders();
    this.app.listen(this.port, () => {
      this.logger.info(`Server started on port ${this.port}`);
    });
  }
}
