import { IMQuery, CommonActions } from "./commonActions";

import { ndBenchTestings } from "../database/schema/ndBenchTestings";

export class NDBenchTestingsAction {

  getList = async(conditions: IMQuery["conditions"] = {}, otherParams?: IMQuery) => {

    try {
      let result = await CommonActions.getList(
        ndBenchTestings,
        {
          conditions,
          page: 1,
          perPage: 10,
          ...otherParams
        }
      );
      return result;
    } catch (error) {
      console.error(error);
      return [];
    }

  };




}