import { Document } from "mongoose";

export interface IWorkload extends Document {
  CPUUtilization_Average?: number,
  NetworkIn_Average?: number,
  NetworkOut_Average?: number,
  MemoryUtilization_Average?: number,
  Final_Target?: number,
}