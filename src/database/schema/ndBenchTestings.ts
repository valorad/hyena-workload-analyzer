import { model, Schema } from 'mongoose';

import { IWorkload } from "../interface/IWorkload.interface";

const schema = new Schema({

  CPUUtilization_Average: {
    type: Number,
    required: true
  },

  NetworkIn_Average: {
    type: Number,
    required: true
  },

  NetworkOut_Average: {
    type: Number,
    required: true
  },

  MemoryUtilization_Average: {
    type: Number,
    required: true
  },

  Final_Target: {
    type: Number,
    required: true
  },

});

export const ndBenchTestings = model<IWorkload>('NDBenchTestings', schema, "NDBenchTestings");