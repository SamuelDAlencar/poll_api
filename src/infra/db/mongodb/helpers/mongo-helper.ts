import { Collection, MongoClient } from "mongodb";
import { AccountModel } from "../../../../domain/models/account";

export const MongoHelper = {
  client: null as MongoClient,

  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },

  async disconnect(): Promise<void> {
    await this.client.close();
  },

  async getCollection(name: string): Promise<Collection> {
    return await this.client.db().collection(name);
  },

  map: (collection: any): AccountModel => {
    const { _id, ...collectionWithoutId } = collection;

    return Object.assign({}, collectionWithoutId, {
      id: _id.toString(),
    });
  },
};
