import { drizzle } from "drizzle-orm/neon-http";

// eslint-disable-next-line node/no-process-env
export const db = drizzle(process.env.DATABASE_URL!);
