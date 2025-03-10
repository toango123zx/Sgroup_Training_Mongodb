import { Source } from '../source';
import EventEmitter from 'events';
import Post from '../../../internal/model/post';
import { RedisClientType } from 'redis';

class PostSource implements Source {
  async get(redisClient: RedisClientType): Promise<EventEmitter> {
    const eventEmitter = new EventEmitter();

    Post.watch()
      .on('change', async (data: any) => {
        console.log(JSON.stringify(data));
        if (data.operationType == 'insert') {
          eventEmitter.emit('change', data.fullDocument);
        }
        if (data.operationType == 'delete') {
          eventEmitter.emit('remove', data.documentKey);
        }
      });

    return eventEmitter;
  }
}

export {
  PostSource,
};
