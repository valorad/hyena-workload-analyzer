import * as Router from 'koa-router';
import { CommonResponse } from './commonResponse';
import { NDBenchTrainingsAction as Action } from '../actions/ndBenchTrainings.action';

class NDBenchTrainingsRoute {
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
      ctx.body = {message: `get metrics ${ctx.params.metric} from Training`}

    });



  }


}

const _ndBenchTrainingsRoute = new NDBenchTrainingsRoute();

export const ndBenchTrainingsRoute = _ndBenchTrainingsRoute.router;