import * as Router from 'koa-router';
import { CommonResponse } from './commonResponse';
import { NDBenchTestingsAction as Action } from '../actions/ndBenchTestings.action';
import { model, Schema } from 'mongoose';

class NDBenchTestingsRoute {
  router = new Router();
  action = new Action();
  commonRes = new CommonResponse(this.action);

  constructor() {

    this.router.get('/', async (ctx) => {

      ctx.body = await this.commonRes.getList(ctx.query);

    });

    this.router.get('/metrics/:metric', async (ctx) => {
      // e.g. /api/types/testings/metrics/CPUUtilization_Average

      const statCollection = model(`mrResultTestings${ctx.params.metric}`, new Schema({}, {versionKey: false, strict: false}), `mrResultTestings${ctx.params.metric}`);

      const statistics: any[] | undefined = await this.action.getStatistics(statCollection);

      if (statistics && statistics[0]) {
        ctx.body = {
          ok: true,
          result: statistics
        }
        return;
      } else {
        ctx.body = {
          ok: false,
          result: statistics
        }
      }

    });


    this.router.post('/metrics', async (ctx) => {

      const result = await this.action.addStatistics(ctx.request.body.metric);
      ctx.body = result;

    });


  }


}

const _ndBenchTestingsRoute = new NDBenchTestingsRoute();

export const ndBenchTestingsRoute = _ndBenchTestingsRoute.router;