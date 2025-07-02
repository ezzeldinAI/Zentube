import { Ratelimit } from "@upstash/ratelimit";

import { redis } from "./redis";

export const ratelimit = new Ratelimit({
  redis,
  // limiter: Ratelimit.slidingWindow(5, "30s"),
  // the line bellow is just for development purposes (in production update it to be the above line)
  limiter: Ratelimit.slidingWindow(10000, "30s"),
});
