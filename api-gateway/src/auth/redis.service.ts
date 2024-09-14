import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;

  constructor(private jwt: JwtService) {
    this.client = new Redis({
      host: 'localhost',
      port: 6379,
      retryStrategy: times => {
        this.logger.log(`Reconnecting to Redis, attempt ${times}`);
        if (times > 10) throw new Error('Redis connect error');
        return 2000;
      }
    });
    this.addEventListener();
  }

  private addEventListener() {
    this.client.on('connect', () => {
      this.logger.log(`Redis connection - Connection status: Connected`);
    });

    this.client.on('end', () => {
      this.logger.log(`Redis connection - Connection status: Disconnected`);
    });

    this.client.on('reconnecting', () => {
      this.logger.log(`Redis connection - Connection status: Reconnecting`);
    });

    this.client.on('error', err => {
      this.logger.error(`Redis connection - Connection status: Error ${err}`);
    });
  }

  private generateTokenKey(userId: string, token: string, tokenType: 'access' | 'refresh'): string {
    return `${userId}:${tokenType}Token:${token}`;
  }

  private getUserIdFromToken(token: string): string {
    const decoded = this.jwt.decode(token);
    if (!decoded?.id) throw new Error('Invalid token - userId not found');
    return decoded.id;
  }

  async storeToken(tokens: { accessToken: string; refreshToken: string }): Promise<void> {
    const { accessToken, refreshToken } = tokens;
    const userId = this.getUserIdFromToken(accessToken);
    const accessKey = this.generateTokenKey(userId, accessToken, 'access');
    const refreshKey = this.generateTokenKey(userId, refreshToken, 'refresh');
    try {
      await this.client
        .multi()
        .set(accessKey, 'OK', 'EX', 60 * 60)
        .set(refreshKey, 'OK', 'EX', 60 * 60 * 24 * 7)
        .exec();
      this.logger.log(`Stored tokens for user ${userId}`);
    } catch (error) {
      this.logger.error(`Error storing tokens for user ${userId}`, error);
      throw new Error(`Failed to store tokens`);
    }
  }

  async isValidToken(token: string, tokenType: 'access' | 'refresh'): Promise<boolean> {
    const userId = this.getUserIdFromToken(token);
    const key = this.generateTokenKey(userId, token, tokenType);
    try {
      const exists = await this.client.exists(key);
      return exists === 1;
    } catch (error) {
      this.logger.error(`Error retrieving ${tokenType} token for user ${userId}`, error);
      throw new Error(`Failed to retrieve ${tokenType} token`);
    }
  }

  async deleteToken(token: string, tokenType: 'access' | 'refresh'): Promise<void> {
    const userId = this.getUserIdFromToken(token);
    const key = this.generateTokenKey(userId, token, tokenType);
    try {
      await this.client.del(key);
      this.logger.log(`Deleted tokens for user ${userId}`);
    } catch (error) {
      this.logger.error(`Error deleting tokens for user ${userId}`, error);
      throw new Error(`Failed to delete tokens`);
    }
  }

  async deleteAllTokensForUser(userId: string): Promise<void> {
    try {
      const accessKeys = await this.client.keys(`${userId}:accessToken:*`);
      const refreshKeys = await this.client.keys(`${userId}:refreshToken:*`);
      if (accessKeys.length > 0) {
        await this.client.del(accessKeys);
        this.logger.log(`Deleted all access tokens for user ${userId}`);
      }
      if (refreshKeys.length > 0) {
        await this.client.del(refreshKeys);
        this.logger.log(`Deleted all refresh tokens for user ${userId}`);
      }
    } catch (error) {
      this.logger.error(`Error deleting all tokens for user ${userId}`, error);
      throw new Error('Failed to delete all tokens for user');
    }
  }

  // Clean up Redis connection on shutdown
  async onModuleDestroy() {
    await this.client.quit();
    this.logger.log('Redis connection closed');
  }
}
