import { resolve } from 'path';

import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as logger from 'koa-logger';
import * as serve from 'koa-static';
import * as bodyParser from 'koa-bodyparser';
import * as cors from "@koa/cors";

import { ConfigLoader } from './lib/configLoader';
import { api } from './routes';

const app = new Koa();

let config = new ConfigLoader("hyenaWA.json").config();

// handling config
if (config) {
  let port: number = config.koa.port;

  const router = new Router();
  
  app.use(logger());
  app.use(cors());
  app.use(bodyParser());
  app.use(serve(resolve(__dirname, "./statics")));

  router.use('/api', api.routes(), api.allowedMethods())
  app.use(router.routes())
    .use(router.allowedMethods());

  // listen
  app.listen(port, () => {
    console.log(`** koa started on port ${port}. **`);
  });

} else {
  console.error("Invalid config detected, program shutting down");
  process.exit(-1);
}

export default app;