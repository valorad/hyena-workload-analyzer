import * as Router from 'koa-router';
import { CommonResponse } from './commonResponse';
import { NDBenchTestingsAction as Action } from '../actions/ndBenchTestings.action';
import { model, Schema } from 'mongoose';

class NDBenchTestingsRoute {
  router = new Router();
  action = new Action();
  commonRes = new CommonResponse(this.action);
  dynamicModels: any = {};

  constructor() {

    this.router.get('/', async (ctx) => {

      ctx.body = await this.commonRes.getList(ctx.query);

    });

    this.router.get('/metrics/:metric', async (ctx) => {
      // e.g. /api/types/testings/metrics/CPUUtilization_Average

      const collectionName = `mrResultTestings${ctx.params.metric}`;

      // init models if is the first time calling this route
      if (!this.dynamicModels[collectionName]) {
        this.dynamicModels[collectionName] = model(collectionName, new Schema({}, {versionKey: false, strict: false}), collectionName);
      }
      const statistics: any[] | undefined = await this.action.getStatistics(this.dynamicModels[collectionName]);

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