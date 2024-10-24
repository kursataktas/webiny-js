import {
    IDataSynchronizationInput,
    IDataSynchronizationManager,
    IFactories
} from "~/tasks/dataSynchronization/types";
import { IIndexManager } from "~/settings/types";
import { ElasticsearchSynchronize } from "~/tasks/dataSynchronization/elasticsearch/ElasticsearchSynchronize";
import { ElasticsearchFetcher } from "~/tasks/dataSynchronization/elasticsearch/ElasticsearchFetcher";

export interface IDataSynchronizationTaskRunnerParams {
    manager: IDataSynchronizationManager;
    indexManager: IIndexManager;
    factories: IFactories;
}

export class DataSynchronizationTaskRunner {
    private readonly manager: IDataSynchronizationManager;
    private readonly indexManager: IIndexManager;
    private readonly factories: IFactories;

    public constructor(params: IDataSynchronizationTaskRunnerParams) {
        this.manager = params.manager;
        this.indexManager = params.indexManager;
        this.factories = params.factories;
    }

    public async run(input: IDataSynchronizationInput) {
        /**
         * First we go through the regular DynamoDB table and insert the data which is missing in the go Elasticsearch table.
         */
        //
        if (!input.dynamoDb?.finished) {
            const sync = this.factories.createDynamoDbSync({
                manager: this.manager
            });
            try {
                return await sync.run(input);
            } catch (ex) {
                return this.manager.response.error(ex);
            }
        }
        /**
         * Then we go through the Elasticsearch table and insert the data we are missing in the Elasticsearch.
         */
        //
        else if (!input.dynamoDbElasticsearch?.finished) {
            const sync = this.factories.createDynamoDbElasticsearchSync({
                manager: this.manager
            });
            try {
                return await sync.run(input);
            } catch (ex) {
                return this.manager.response.error(ex);
            }
        }
        /**
         * Then we go through the Elasticsearch and delete records which do not exist in the Elasticsearch table.
         */
        //
        else if (!input.elasticsearchToDynamoDb?.finished) {
            const sync = this.factories.createElasticsearchToDynamoDbSync({
                manager: this.manager,
                indexManager: this.indexManager,
                synchronize: new ElasticsearchSynchronize({
                    context: this.manager.context,
                    timer: this.manager.timer
                }),
                fetcher: new ElasticsearchFetcher({
                    client: this.manager.elasticsearch
                })
            });
            try {
                return await sync.run(input);
            } catch (ex) {
                return this.manager.response.error(ex);
            }
        }
        /**
         * At this point, all the keys in the input must have finished set to true. If not, something went very wrong.
         */
        for (const key in input) {
            const value = input[key as keyof IDataSynchronizationInput];
            if (!value?.finished) {
                return this.manager.response.error(`Task "${key}" did not finish.`);
            }
        }
        /**
         * We are done.
         */
        return this.manager.response.done();
    }
}
