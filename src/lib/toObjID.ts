import { ObjectId } from "mongodb";


export const toObjID = (objId: ObjectId | string) => {
  try {
    let id: ObjectId;

    if (typeof objId === 'string') {
      id = new ObjectId(objId);
      return id;
    } else if ((objId instanceof ObjectId)) {
      id = objId;
      return id;
    }
    return null;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return null;
  }
};