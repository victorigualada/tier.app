import config from 'config';
import { ShortURL } from '../interfaces/url';
import { UrlRepository } from '../repository/url.repository';
const LRUCache = require('lru-cache'); // eslint-disable-line @typescript-eslint/no-var-requires

export class UrlService {
  private readonly alphabet: string;
  private readonly urlLength: number;
  private readonly urlCache: typeof LRUCache;
  private readonly shortCache: typeof LRUCache;

  constructor(private readonly urlRepository: UrlRepository) {
    this.alphabet = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789';
    this.urlLength = config.get('urlLength');
    this.urlCache = new LRUCache({ max: config.get('urlCacheSize') });
    this.shortCache = new LRUCache({ max: config.get('urlCacheSize') });
  }

  private generateRandomString(): string {
    let result = '';
    const length = this.alphabet.length;

    for (let i = 0; i < this.urlLength; i++) {
      const index = Math.floor(Math.random() * length);
      result += this.alphabet[index];
    }

    return result;
  }

  async shortenUrl(url: string): Promise<string> {
    const existingUrl = this.urlCache.get(url) || await this.urlRepository.findByLongUrl(url);
    if (existingUrl) {
      return existingUrl.short;
    }
    let shortUrl = this.generateRandomString();
    while (this.shortCache.has(shortUrl) || await this.urlRepository.shortUrlExists(url)) {
      shortUrl = this.generateRandomString();
    }
    const savedUrlId = await this.urlRepository.save(url, shortUrl);
    await this.urlRepository.createVisit(savedUrlId);
    this.urlCache.set(url, shortUrl);
    return shortUrl;
  }

  async getUrl(shortUrl: string): Promise<string> {
    const url: ShortURL = this.shortCache.get(shortUrl) || await this.urlRepository.findByShortUrl(shortUrl);
    if (!url) {
      return;
    }
    this.urlRepository.incrementVisits(url.id);
    return url.url;
  }
}
