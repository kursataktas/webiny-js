import { IFactories } from "./types";
import { DynamoDbElasticsearchSynchronization } from "./dynamoDbElasticsearch/DynamoDbElasticsearchSynchronization";
import { ElasticsearchToDynamoDbSynchronization } from "./elasticsearch/ElasticsearchToDynamoDbSynchronization";
import { DynamoDbSynchronization } from "./dynamoDb/DynamoDbSynchronization";

export const createFactories = (): IFactories => {
    return {
        createElasticsearchToDynamoDbSync: params => {
            return new ElasticsearchToDynamoDbSynchronization(params);
        },
        createDynamoDbElasticsearchSync: params => {
            return new DynamoDbElasticsearchSynchronization(params);
        },
        createDynamoDbSync: params => {
            return new DynamoDbSynchronization(params);
        }
    };
};
