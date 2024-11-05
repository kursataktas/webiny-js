import { ElasticsearchToDynamoDbSynchronization } from "~/tasks/dataSynchronization/elasticsearch/ElasticsearchToDynamoDbSynchronization";
import { useHandler } from "~tests/helpers/useHandler";
import { createManagers } from "./managers";
import { ElasticsearchFetcher } from "~/tasks/dataSynchronization/elasticsearch/ElasticsearchFetcher";
import { ElasticsearchSynchronize } from "~/tasks/dataSynchronization/elasticsearch/ElasticsearchSynchronize";
import { createDataSynchronization, DATA_SYNCHRONIZATION_TASK } from "~/tasks";
import { Context, SynchronizationBuilder } from "@webiny/api-dynamodb-to-elasticsearch";
import { ITimer } from "@webiny/handler-aws";
import { IIndexManager } from "~/settings/types";
import { createRunner } from "@webiny/project-utils/testing/tasks";
import { TaskResponseStatus } from "@webiny/tasks";
import { IElasticsearchSynchronizeExecuteResponseKey } from "~/tasks/dataSynchronization/elasticsearch/abstractions/ElasticsearchSynchronize";

const queryAllRecords = (index: string) => {
    return {
        index,
        body: {
            query: {
                match_all: {}
            },
            size: 10000,
            _source: false
        }
    };
};

interface ICreateSyncBuilderParams {
    records: number;
    timer: ITimer;
    context: Pick<Context, "elasticsearch">;
    index: string;
}

const createKeys = (amount: number): IElasticsearchSynchronizeExecuteResponseKey[] => {
    return Array.from({ length: amount })
        .fill(undefined)
        .map((_, current) => {
            return {
                index: expect.any(String),
                id: `pkValue${current}:skValue${current}`
            };
        })
        .sort((a, b) => a.id.localeCompare(b.id));
};

const createRecordsFactory = (params: ICreateSyncBuilderParams) => {
    const { timer, context, index, records } = params;
    const syncBuilder = new SynchronizationBuilder({
        timer,
        context
    });

    for (let i = 0; i < records; i++) {
        syncBuilder.insert({
            id: `pkValue${i}:skValue${i}`,
            index,
            data: {
                id: `skValue${i}`,
                aText: `myText - ${i}`
            }
        });
    }
    return {
        run: () => {
            return syncBuilder.build()();
        }
    };
};

const getTaskIndex = async (manager: IIndexManager): Promise<string> => {
    const indexes = await manager.list();
    const index = indexes.find(
        index => index.includes("webinytask") && index.includes("-headless-cms-")
    );
    if (!index) {
        throw new Error("No index found.");
    }
    return index;
};

describe("ElasticsearchToDynamoDbSynchronization", () => {
    it("should run a sync without any indexes and throw an error", async () => {
        const handler = useHandler();

        const context = await handler.rawHandle();

        const { manager, indexManager } = createManagers({
            context
        });

        const sync = new ElasticsearchToDynamoDbSynchronization({
            manager,
            indexManager,
            fetcher: new ElasticsearchFetcher({
                client: context.elasticsearch
            }),
            synchronize: new ElasticsearchSynchronize({
                context,
                timer: manager.timer
            })
        });

        try {
            const result = await sync.run({
                flow: "elasticsearchToDynamoDb",
                skipDryRun: true
            });
            expect(result).toEqual("Should not reach this point.");
        } catch (ex) {
            expect(ex.message).toBe("No Elasticsearch / OpenSearch indexes found.");
        }
    });

    it("should run a sync with indexes and return done on dry run", async () => {
        const handler = useHandler();

        const context = await handler.rawHandle();

        const task = await context.tasks.createTask({
            definitionId: DATA_SYNCHRONIZATION_TASK,
            input: {
                flow: "elasticsearchToDynamoDb"
            },
            name: "Data Sync Mock Task"
        });

        const { manager, indexManager } = createManagers({
            context
        });

        const index = await getTaskIndex(indexManager);

        const totalMockItemsToInsert = 101;
        const recordsFactory = createRecordsFactory({
            context,
            index,
            timer: manager.timer,
            records: totalMockItemsToInsert
        });
        try {
            await recordsFactory.run();
        } catch (ex) {
            expect(ex.message).toBe("Should not reach this point.");
        }
        /**
         * Now we need to make sure that the mock data is in the index.
         */
        const response = await context.elasticsearch.search(queryAllRecords(index));
        expect(response.body.hits.hits).toHaveLength(totalMockItemsToInsert + 1);

        const runner = createRunner({
            context,
            task: createDataSynchronization(),
            onContinue: async () => {
                return;
            }
        });

        const result = await runner({
            webinyTaskId: task.id,
            locale: "en-US",
            tenant: "root"
        });

        expect(result).toEqual({
            locale: "en-US",
            message: "Dry run.",
            output: {
                // @ts-expect-error
                keys: createKeys(result.output.keys.length)
            },
            status: TaskResponseStatus.DONE,
            tenant: "root",
            webinyTaskDefinitionId: task.definitionId,
            webinyTaskId: task.id
        });
    });

    it("should run a sync with indexes and finish", async () => {
        const handler = useHandler();

        const context = await handler.rawHandle();

        await context.tasks.createTask({
            definitionId: DATA_SYNCHRONIZATION_TASK,
            input: {
                flow: "elasticsearchToDynamoDb"
            },
            name: "Data Sync Mock Task"
        });

        const { manager, indexManager } = createManagers({
            context
        });

        const index = await getTaskIndex(indexManager);

        const totalMockItemsToInsert = 101;
        const recordsFactory = createRecordsFactory({
            context,
            index,
            timer: manager.timer,
            records: totalMockItemsToInsert
        });
        try {
            await recordsFactory.run();
        } catch (ex) {
            expect(ex.message).toBe("Should not reach this point.");
        }
        /**
         * Now we need to make sure that the mock data is in the index.
         */
        const response = await context.elasticsearch.search(queryAllRecords(index));
        expect(response.body.hits.hits).toHaveLength(totalMockItemsToInsert + 1);

        const sync = new ElasticsearchToDynamoDbSynchronization({
            manager,
            indexManager,
            fetcher: new ElasticsearchFetcher({
                client: context.elasticsearch
            }),
            synchronize: new ElasticsearchSynchronize({
                context,
                timer: manager.timer
            })
        });

        const result = await sync.run({
            flow: "elasticsearchToDynamoDb",
            skipDryRun: true
        });
        expect(result).toEqual({
            delay: -1,
            input: {
                elasticsearchToDynamoDb: {
                    finished: true
                },
                flow: "elasticsearchToDynamoDb",
                skipDryRun: true
            },
            locale: "en-US",
            message: undefined,
            status: "continue",
            tenant: "root",
            wait: undefined,
            webinyTaskDefinitionId: "mockDefinitionId",
            webinyTaskId: "mockEventId"
        });
        /**
         * Now we need to make sure that the mock data is not in the index anymore.
         */
        const afterRunResponse = await context.elasticsearch.search(queryAllRecords(index));
        expect(afterRunResponse.body.hits.hits).toHaveLength(1);
    });
});
