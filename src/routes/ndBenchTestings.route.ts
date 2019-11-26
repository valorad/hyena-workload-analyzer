import * as Router from 'koa-router';
import { CommonResponse } from './commonResponse';

class NDBenchTestingsRoute {
  router = new Router();

  // commonRes = new CommonResponse(this.action);

  constructor() {

    this.router.get('/', async (ctx) => {

      // ctx.body = await this.query.getList(ctx.query);
      ctx.body = {message: "getList"}

    });

    this.router.get('/metrics/:metric', async (ctx) => {
      // e.g. /api/types/training/metrics/CPUUtilization_Average

      // ctx.body = await this.query.getList(ctx.query);
      ctx.body = {message: `get metrics ${ctx.params.metric} from Testing`}

    });



  }


}

const _ndBenchTestingsRoute = new NDBenchTestingsRoute();

export const ndBenchTestingsRoute = _ndBenchTestingsRoute.router;