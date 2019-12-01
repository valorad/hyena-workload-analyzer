import * as Router from 'koa-router';
import { CommonResponse } from './commonResponse';
import { NDBenchTrainingsAction as Action } from '../actions/ndBenchTrainings.action';
import { model, Schema } from 'mongoose';

class NDBenchTrainingsRoute {
  router = new Router();
  action = new Action();
  commonRes = new CommonResponse(this.action);
  dynamicModels: any = {};

  constructor() {

    this.router.get('/', async (ctx) => {

      ctx.body = await this.commonRes.getList(ctx.query);

    });

    this.router.get('/metrics/:metric', async (ctx) => {
      // e.g. /api/types/trainings/metrics/CPUUtilization_Average

      const collectionName = `mrResultTrainings${ctx.params.metric}`;

      // init models if is the first time calling this route
      if (!this.dynamicModels[collectionName]) {
        this.dynamicModels[collectionName] = model(collectionName, new Schema({}, {versionKey: false, strict: false}), collectionName);
      }

      // const statCollection = model(`mrResultTrainings${ctx.params.metric}`, new Schema({}, {versionKey: false, strict: false}), `mrResultTrainings${ctx.params.metric}`);

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

const _ndBenchTrainingsRoute = new NDBenchTrainingsRoute();

export const ndBenchTrainingsRoute = _ndBenchTrainingsRoute.router;