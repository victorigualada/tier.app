import { Connection, ResultSetHeader, RowDataPacket } from 'mysql2';
import { Logger } from '../../shared/logger';
import { ShortURL } from '../interfaces/url';

export class UrlRepository {
  private readonly logger: Logger;

  constructor(private readonly connection: Connection) {
    this.logger = new Logger(this.constructor.name);
  }

  async shortUrlExists(url: string): Promise<boolean> {
    const sql = 'SELECT * FROM urls WHERE short = ?';
    const values = [url];
    return new Promise((resolve, reject) => {
      this.connection.execute(sql, values,  (error, results: RowDataPacket[]) => {
        if (error) {
          this.logger.error(error.toString());
          reject(error);
        }
        resolve(results.length > 0);
      })
    });
  }

  createVisit(urlId: number): Promise<void> {
    const sql = 'INSERT INTO statistics (url_id) VALUES (?)';
    const values = [urlId];
    return new Promise((resolve, reject) => {
      this.connection.execute(sql, values,  (error) => {
        if (error) {
          this.logger.error(error.toString());
          reject(error);
        }
        resolve();
      })
    });
  }

  save(url: string, short: string): Promise<number> {
    const sql = 'INSERT INTO urls (url, short) VALUES (?, ?)';
    const values = [url, short];
    return new Promise((resolve, reject) => {
      this.connection.execute(sql, values, (error, results: ResultSetHeader) => {
        if (error) {
          this.logger.error(error.toString());
          reject(error);
        }
        resolve(results.insertId);
      })
    });
  }

  findByLongUrl(url: string): Promise<ShortURL> {
    return this.find('url', url);
  }

  findByShortUrl(shortUrl: string): Promise<ShortURL> {
    return this.find('short', shortUrl);

  }

  find(field: string, value: string): Promise<ShortURL> {
    const sql = `SELECT * FROM urls WHERE ${field} = ?`;
    const values = [value];
    return new Promise((resolve, reject) => {
      this.connection.execute(sql, values, (error, results: RowDataPacket[]) => {
        if (error) {
          this.logger.error(error.toString());
          reject(error);
        }
        resolve(results[0] as ShortURL);
      })
    });
  }

  incrementVisits(id: number): Promise<void> {
    const sql = 'UPDATE statistics SET visits = visits + 1 WHERE id = ?';
    const values = [id];
    return new Promise((resolve, reject) => {
      this.connection.execute(sql, values, (error) => {
        if (error) {
          this.logger.error(error.toString());
          reject(error);
        }
        resolve();
      })
    });
  }
}
