import { DbAddAccount } from "../../../../../data/useCases/add-account/db-add-account";
import { AddAccount } from "../../../../../domain/useCases/add-account";
import { BcryptAdapter } from "../../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter";
import { AccountMongoRepository } from "../../../../../infra/db/mongodb/account/account-mongo-repository";


export const makeDbAddAccount = (): AddAccount => {
  const salt = 12;

  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();

  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository);

  return dbAddAccount;
};
