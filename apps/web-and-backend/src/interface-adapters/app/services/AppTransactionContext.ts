import { TransactionContext } from "../../../application-layer/ports/TransactionContext.port";
import { MemoryTransactionContext } from "../../../infra/transaction-context/MemoryTransactionContext/MemoryTransactionContext";
import { MongoTransactionContext } from "../../../infra/transaction-context/MongoTransactionContext/MongoTransactionContext";
import { injectFor_ProductionDevelopment_Test } from "../../common/injectFor_ProductionDevelopment_Test";

import { mongooseInitPromise } from "../repos/common/initMongoose";

const AppTransactionContext: TransactionContext =
  await injectFor_ProductionDevelopment_Test<TransactionContext>(
    MongoTransactionContext,
    MemoryTransactionContext,
    {
      beforeProdDev: async () => {
        await mongooseInitPromise;
      },
    },
  );

export { AppTransactionContext };
