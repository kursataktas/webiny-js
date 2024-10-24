import {
    IDataSynchronizationInput,
    IDataSynchronizationManager,
    IDynamoDbSyncParams,
    ISynchronization,
    ISynchronizationRunResult
} from "../types";
import { getTable } from "~/tasks/dataSynchronization/entities/getTable";
import {
    DynamoDbScanner,
    IDynamoDbScannerScanParamsKeys
} from "~/tasks/dataSynchronization/scanner/DynamoDbScanner";
import { listElasticsearchEntities } from "~/tasks/dataSynchronization/entities";
import { GenericRecord } from "@webiny/api/types";
import { Entity, TableDef } from "@webiny/db-dynamodb/toolbox";
import { batchReadAll, BatchReadItem } from "@webiny/db-dynamodb";
import { IRegistryItem } from "@webiny/db";

interface DynamoDbScannerScanItem {
    PK: string;
    SK: string;
    entity: string;
}

interface IFindMissingParams {
    results: DynamoDbScannerScanItem[];
    table: TableDef;
    entities: GenericRecord<string, IRegistryItem<Entity>>;
}

const attributes: (keyof DynamoDbScannerScanItem)[] = ["PK", "SK", "entity"];

export class DynamoDbSynchronization implements ISynchronization {
    private readonly manager: IDataSynchronizationManager;

    public constructor(params: IDynamoDbSyncParams) {
        this.manager = params.manager;
    }

    public async run(input: IDataSynchronizationInput): Promise<ISynchronizationRunResult> {
        let keys = input.dynamoDb?.keys;
        const table = getTable({
            type: "regular",
            context: this.manager.context
        });

        const scanner = new DynamoDbScanner<DynamoDbScannerScanItem>({
            table,
            attributes
        });

        const entities = listElasticsearchEntities({
            context: this.manager.context
        }).reduce<GenericRecord<string, IRegistryItem<Entity>>>((collection, item) => {
            collection[item.item.name] = item;
            return collection;
        }, {});

        let result: Awaited<ReturnType<typeof scanner.scan>>;

        while ((result = await scanner.scan({ keys }))) {
            if (this.manager.isAborted()) {
                return this.manager.response.aborted();
            } else if (this.manager.isCloseToTimeout(180)) {
                return this.manager.response.continue({
                    ...input,
                    dynamoDb: {
                        ...input.dynamoDb,
                        keys
                    }
                });
            }
            /**
             * Next key to scan from.
             */
            keys = result.lastEvaluatedKey as unknown as IDynamoDbScannerScanParamsKeys | undefined;

            const missing = await this.findMissing({
                results: result.items,
                table,
                entities
            });
            /**
             * Now we need to sync the DynamoDB table to the Elasticsearch table.
             */
            for (const item of missing) {
                // TODO build a sync for each of the apps?
            }
        }

        return this.manager.response.continue({
            ...input,
            dynamoDb: {
                finished: true
            }
        });
    }

    private async findMissing(params: IFindMissingParams): Promise<DynamoDbScannerScanItem[]> {
        const { results, table, entities } = params;
        /**
         * We need to fetch all the items from the Elasticsearch table.
         */
        const batch = results.reduce<BatchReadItem[]>((collection, item) => {
            const entity = entities[item.entity];
            if (!entity?.item) {
                return collection;
            }
            collection.push(
                entity.item.getBatch({
                    PK: item.PK,
                    SK: item.SK
                })
            );
            return collection;
        }, []);
        if (batch.length === 0) {
            return [];
        }
        const items = await batchReadAll<DynamoDbScannerScanItem>({
            items: batch,
            table
        });
        /**
         * Now let's figure out what is missing in the Elasticsearch table.
         */
        return results.filter(target => {
            return items.some(item => {
                return item.PK === target.PK && item.SK === target.SK;
            });
        });
    }
}
