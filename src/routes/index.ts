import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';

// sub routes


class API {
  static routerInstance = new Router();

  static get router(): Router {
    
    /* GET api listing. */
    this.routerInstance.get('/', async (ctx) => {
      ctx.status = 200;
      ctx.body = {
        message: "api works!"
      }
    });

    // sub routes

    return this.routerInstance;

  }

}

export const api = API.router;