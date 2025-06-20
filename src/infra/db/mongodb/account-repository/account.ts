import { AddAccountRepository } from "../../../../data/protocols/add-account-repository";
import { AddAccountModel } from "../../../../domain/useCases/add-account";
import { AccountModel } from "../../../../domain/models/account";
import { MongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");

    const response = await accountCollection.insertOne(accountData);

    const insertedId = response.insertedId;

    const insertedDocument = await accountCollection.findOne({
      _id: insertedId,
    });

    return MongoHelper.map(insertedDocument);
  }
}
