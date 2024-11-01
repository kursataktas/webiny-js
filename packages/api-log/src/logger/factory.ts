import { createDynamoDbLogger, createStorageOperations, DynamoDbLoggerKeys } from "./dynamodb";
import { create } from "~/db";
import { Context } from "~/types";

export interface ILoggerFactoryParams {
    context: Pick<Context, "db">;
    getTenant: () => string;
    getLocale: () => string;
}

export const loggerFactory = ({ getTenant, getLocale, context }: ILoggerFactoryParams) => {
    const keys = new DynamoDbLoggerKeys();
    const { entity } = create({
        // @ts-expect-error
        documentClient: context.db.driver.documentClient
    });

    const storageOperations = createStorageOperations({
        entity,
        keys
    });

    return {
        logger: createDynamoDbLogger({
            onFlush: async items => {
                return await storageOperations.insert({
                    items
                });
            },
            getLocale,
            getTenant
        }),
        storageOperations
    };
};
