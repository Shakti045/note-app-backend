import Redis from "ioredis";

const redisuri = process.env.REDIS_URI;
const redis = new Redis(redisuri);

export default redis;