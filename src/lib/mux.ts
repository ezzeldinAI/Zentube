import Mux from "@mux/mux-node";

export const mux = new Mux({
  // eslint-disable-next-line node/no-process-env
  tokenId: process.env.MUX_TOKEN_ID,
  // eslint-disable-next-line node/no-process-env
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});
