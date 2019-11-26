import { connectDB } from './access';
import { ConfigLoader } from "../lib/configLoader";

export class DataBase {

  siteConfig = new ConfigLoader("hyenaWA.json").config();

  dbConfig = {
    ...this.siteConfig.mongo,
    db: {
      auth: this.siteConfig.mongo.db.auth,
      apply: this.siteConfig.mongo.db.main
    }
  }

  connect = async () => {
    // if (process.env.isTesting === 'yes') {
    //   this.dbConfig.db.apply = this.siteConfig.mongo.db.test;
    // }
    return await connectDB(this.dbConfig);
  };

}