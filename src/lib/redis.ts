import { Redis } from "@upstash/redis";

export const redis = new Redis({
  // eslint-disable-next-line node/no-process-env
  url: process.env.UPSTASH_REDIS_REST_URL!,
  // eslint-disable-next-line node/no-process-env
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
