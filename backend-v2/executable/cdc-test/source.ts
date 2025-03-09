import EventEmitter from 'events';
import { RedisClientType } from 'redis';

interface Source {
  get: (redisClient: RedisClientType) => Promise<EventEmitter>;
}

export {
  Source,
}