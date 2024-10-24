import { IManager } from "~/types";
import { PrimitiveValue } from "@webiny/api-elasticsearch/types";
import { IIndexManager } from "~/settings/types";
import {
    ITaskResponseAbortedResult,
    ITaskResponseContinueResult,
    ITaskResponseErrorResult
} from "@webiny/tasks";
import { AttributeDefinition } from "@webiny/db-dynamodb/toolbox";
import { IElasticsearchSynchronize } from "~/tasks/dataSynchronization/elasticsearch/abstractions/ElasticsearchSynchronize";
import { IElasticsearchFetcher } from "~/tasks/dataSynchronization/elasticsearch/abstractions/ElasticsearchFetcher";

export interface IDataSynchronizationInputValue {
    finished?: boolean;
}

export interface IDataSynchronizationInputElasticsearchToDynamoDbValue
    extends IDataSynchronizationInputValue {
    index?: string;
    cursor?: PrimitiveValue[];
}

export interface IDataSynchronizationInputDynamoDbValue extends IDataSynchronizationInputValue {
    keys?: {
        PK: string;
        SK: string;
    };
}

export interface IDataSynchronizationInput {
    elasticsearchToDynamoDb?: IDataSynchronizationInputElasticsearchToDynamoDbValue;
    dynamoDbElasticsearch?: IDataSynchronizationInputValue;
    dynamoDb?: IDataSynchronizationInputDynamoDbValue;
}

export type ISynchronizationRunResult =
    | ITaskResponseContinueResult<IDataSynchronizationInput>
    | ITaskResponseErrorResult
    | ITaskResponseAbortedResult;

export interface ISynchronization {
    run(input: IDataSynchronizationInput): Promise<ISynchronizationRunResult>;
}

export interface IElasticsearchSyncParams {
    manager: IDataSynchronizationManager;
    indexManager: IIndexManager;
    synchronize: IElasticsearchSynchronize;
    fetcher: IElasticsearchFetcher;
}

export interface IElasticsearchSyncFactory {
    (params: IElasticsearchSyncParams): ISynchronization;
}

export interface IDynamoDbElasticsearchSyncParams {
    manager: IDataSynchronizationManager;
}

export interface IDynamoDbElasticsearchSyncFactory {
    (params: IDynamoDbElasticsearchSyncParams): ISynchronization;
}

export interface IDynamoDbSyncParams {
    manager: IDataSynchronizationManager;
}

export interface IDynamoDbSyncFactory {
    (params: IDynamoDbSyncParams): ISynchronization;
}

export interface IFactories {
    /**
     * Delete all the records which are in the Elasticsearch but not in the Elasticsearch DynamoDB table.
     */
    createElasticsearchToDynamoDbSync: IElasticsearchSyncFactory;
    /**
     *
     */
    createDynamoDbElasticsearchSync: IDynamoDbElasticsearchSyncFactory;
    /**
     * Insert all records which exist in regular DynamoDB table but not in the Elasticsearch DynamoDB table.
     */
    createDynamoDbSync: IDynamoDbSyncFactory;
}

export type IDataSynchronizationManager = IManager<IDataSynchronizationInput>;

export type EntityAttributes = Record<string, AttributeDefinition>;
