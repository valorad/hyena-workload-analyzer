import * as Router from 'koa-router';
import { CommonResponse } from './commonResponse';
import { NDBenchTestingsAction as Action } from '../actions/ndBenchTestings.action';

class NDBenchTestingsRoute {
  router = new Router();
  action = new Action();
  commonRes = new CommonResponse(this.action);

  constructor() {

    this.router.get('/', async (ctx) => {

      ctx.body = await this.commonRes.getList(ctx.query);

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