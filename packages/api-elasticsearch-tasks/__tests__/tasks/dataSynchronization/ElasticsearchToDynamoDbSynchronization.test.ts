import { ElasticsearchToDynamoDbSynchronization } from "~/tasks/dataSynchronization/elasticsearch/ElasticsearchToDynamoDbSynchronization";
import { useHandler } from "~tests/helpers/useHandler";
import { createManagers } from "./managers";
import { ElasticsearchFetcher } from "~/tasks/dataSynchronization/elasticsearch/ElasticsearchFetcher";
import { ElasticsearchSynchronize } from "~/tasks/dataSynchronization/elasticsearch/ElasticsearchSynchronize";
import { DATA_SYNCHRONIZATION_TASK } from "~/tasks";
import { SynchronizationBuilder } from "@webiny/api-dynamodb-to-elasticsearch";

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

    it("should run a sync with indexes and finish", async () => {
        const handler = useHandler();

        const context = await handler.rawHandle();

        await context.tasks.createTask({
            definitionId: DATA_SYNCHRONIZATION_TASK,
            input: {},
            name: "Data Sync Mock Task"
        });

        const { manager, indexManager } = createManagers({
            context
        });

        /**
         * Take first possible index and insert some data directly into it.
         */
        const indexes = await indexManager.list();

        const index = indexes.find(
            index => index.includes("webinytask") && index.includes("-headless-cms-")
        ) as string;
        expect(index).toBeDefined();

        const query = {
            index,
            body: {
                query: {
                    match_all: {}
                },
                size: 10000,
                _source: false
            }
        };

        const syncBuilder = new SynchronizationBuilder({
            timer: manager.timer,
            context
        });

        const totalMockItemsToInsert = 101;

        for (let i = 0; i < 101; i++) {
            syncBuilder.insert({
                id: `pkValue${i}:skValue${i}`,
                index,
                data: {
                    id: `skValue${i}`,
                    aText: `myText - ${i}`
                }
            });
        }

        try {
            await syncBuilder.build()({});
        } catch (ex) {
            expect(ex.message).toBe("Should not reach this point.");
        }
        /**
         * Now we need to make sure that the mock data is in the index.
         */
        const response = await context.elasticsearch.search(query);
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
        const afterRunResponse = await context.elasticsearch.search(query);
        expect(afterRunResponse.body.hits.hits).toHaveLength(1);
    });
});
