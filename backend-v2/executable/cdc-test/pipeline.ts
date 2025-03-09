import { RedisClientType } from 'redis';
import { Sink } from './sink';
import { Source } from './source';
import { UserServiceImpl } from '../command-ingress/features/user/domain/service';
import { UserEntity } from '../command-ingress/features/user/types';

type Transformer = (data: any) => Promise<any>;

interface Operator {
  run: (data: any) => Promise<any>;
}

class Pipeline {
  source: Source;
  sink: Sink;
  operators: Operator[];

  constructor(source: Source, sink: Sink, operators: Operator[]) {
    this.source = source;
    this.sink = sink;
    this.operators = operators;
  }

  async run(redisClient: RedisClientType) {
    const eventEmitter = await this.source.get(redisClient);

    eventEmitter.on('change', async (data) => {
      for (const operator of this.operators) {
        data = await operator.run(data);
      }
      const userRepository = new UserServiceImpl();
      const user: UserEntity = await userRepository.getOne(String(data.author));
      let newfeeds = JSON.parse(await redisClient.get('newfeed')) || {};
      user.followers.forEach((follower) => {
        if (!newfeeds[String(follower.id)]) {
          newfeeds[String(follower.id)] = [data._id];
        }
        else {
          newfeeds[String(follower.id)].push(data._id);
        }
      });
      await redisClient.set('newfeed', JSON.stringify(newfeeds));

      await this.sink.save(data);
    });

    console.log('Pipline started');
  }
}

export {
  Pipeline,
  Transformer,
  Operator,
};
