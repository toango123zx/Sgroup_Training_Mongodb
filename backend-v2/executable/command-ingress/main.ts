import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(process.cwd(), '.env') });
import { createHttpServer } from './app';
import mongoose from 'mongoose';
import env from './utils/env';
import { createClient, RedisClientType } from 'redis';

async function start() {
    await mongoose.connect(env.MONGO_URI);
    const redisClienUrl = String(process.env.REDIS_URL);
    const redisClient = createClient({
        url: redisClienUrl,
    });
    await redisClient.connect();
    const server = createHttpServer(redisClient);

    server.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT}`);
    });

    process.on('SIGINT', () => {
        // redisClient.quit();

        // Avoid connection leak.
        mongoose.connection.close();
        process.exit(0);
    });
}

start().catch((err) => {
    console.error(err);
    process.exit(1);
});