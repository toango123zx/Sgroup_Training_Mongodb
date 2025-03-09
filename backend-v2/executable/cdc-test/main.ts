import { config } from 'dotenv';
import mongoose from 'mongoose';
import { createClient, RedisClientType } from 'redis';
import { Pipeline } from './pipeline';
import { PostSource } from './source/post_source';
import { LogSink } from './sink/log_sink';

config();

async function connectMongoDB() {
  await mongoose.connect(process.env.MONGO_URI);
}

async function connectRedis() {
  const redisClienUrl = String(process.env.REDIS_URL);
  const redisClient = createClient({  // Use createClient directly
    url: redisClienUrl,
  });
  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  await redisClient.connect();

  return redisClient;
}

async function main() {
  await connectMongoDB();
  const redisClient = await connectRedis();

  const source = new PostSource();
  const sink = new LogSink();

  const pipline = new Pipeline(source, sink, []);

  await pipline.run(redisClient as unknown as RedisClientType);
}

main().catch((err) => {
  console.error(err);

  process.exit(1);
});