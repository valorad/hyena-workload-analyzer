import { IMQuery, CommonActions } from "./commonActions";

import { ndBenchTrainings } from "../database/schema/ndBenchTrainings";

export class NDBenchTrainingsAction {

  getList = async(conditions: IMQuery["conditions"] = {}, otherParams?: IMQuery) => {

    try {
      let result = await CommonActions.getList(
        ndBenchTrainings,
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