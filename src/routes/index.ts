import * as Router from 'koa-router';

// sub routes
import { ndBenchTestingsRoute } from "./ndBenchTestings.route";
import { ndBenchTrainingsRoute } from "./ndBenchTrainings.route";

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
    this.routerInstance.use('/testings', ndBenchTestingsRoute.routes(), ndBenchTestingsRoute.allowedMethods());
    this.routerInstance.use('/trainings', ndBenchTrainingsRoute.routes(), ndBenchTrainingsRoute.allowedMethods());

    return this.routerInstance;

  }

}

export const api = API.router;