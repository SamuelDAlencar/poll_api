import { Collection, MongoClient } from "mongodb";
import { AccountModel } from "../../../../domain/models/account";

export const MongoHelper = {
  client: null as MongoClient,
  url: null as string,

  async connect(url: string): Promise<void> {
    this.url = url;
    this.client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },

  async disconnect(): Promise<void> {
    await this.client.close();

    this.client = null;
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.url);
    }

    return await this.client.db().collection(name);
  },

  map: (collection: any): AccountModel => {
    const { _id, ...collectionWithoutId } = collection;

    return Object.assign({}, collectionWithoutId, {
      id: _id.toString(),
    });
  },
};
