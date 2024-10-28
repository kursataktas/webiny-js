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
                keys: [
                    "pkValue0:skValue0",
                    "pkValue1:skValue1",
                    "pkValue10:skValue10",
                    "pkValue100:skValue100",
                    "pkValue11:skValue11",
                    "pkValue12:skValue12",
                    "pkValue13:skValue13",
                    "pkValue14:skValue14",
                    "pkValue15:skValue15",
                    "pkValue16:skValue16",
                    "pkValue17:skValue17",
                    "pkValue18:skValue18",
                    "pkValue19:skValue19",
                    "pkValue2:skValue2",
                    "pkValue20:skValue20",
                    "pkValue21:skValue21",
                    "pkValue22:skValue22",
                    "pkValue23:skValue23",
                    "pkValue24:skValue24",
                    "pkValue25:skValue25",
                    "pkValue26:skValue26",
                    "pkValue27:skValue27",
                    "pkValue28:skValue28",
                    "pkValue29:skValue29",
                    "pkValue3:skValue3",
                    "pkValue30:skValue30",
                    "pkValue31:skValue31",
                    "pkValue32:skValue32",
                    "pkValue33:skValue33",
                    "pkValue34:skValue34",
                    "pkValue35:skValue35",
                    "pkValue36:skValue36",
                    "pkValue37:skValue37",
                    "pkValue38:skValue38",
                    "pkValue39:skValue39",
                    "pkValue4:skValue4",
                    "pkValue40:skValue40",
                    "pkValue41:skValue41",
                    "pkValue42:skValue42",
                    "pkValue43:skValue43",
                    "pkValue44:skValue44",
                    "pkValue45:skValue45",
                    "pkValue46:skValue46",
                    "pkValue47:skValue47",
                    "pkValue48:skValue48",
                    "pkValue49:skValue49",
                    "pkValue5:skValue5",
                    "pkValue50:skValue50",
                    "pkValue51:skValue51",
                    "pkValue52:skValue52",
                    "pkValue53:skValue53",
                    "pkValue54:skValue54",
                    "pkValue55:skValue55",
                    "pkValue56:skValue56",
                    "pkValue57:skValue57",
                    "pkValue58:skValue58",
                    "pkValue59:skValue59",
                    "pkValue6:skValue6",
                    "pkValue60:skValue60",
                    "pkValue61:skValue61",
                    "pkValue62:skValue62",
                    "pkValue63:skValue63",
                    "pkValue64:skValue64",
                    "pkValue65:skValue65",
                    "pkValue66:skValue66",
                    "pkValue67:skValue67",
                    "pkValue68:skValue68",
                    "pkValue69:skValue69",
                    "pkValue7:skValue7",
                    "pkValue70:skValue70",
                    "pkValue71:skValue71",
                    "pkValue72:skValue72",
                    "pkValue73:skValue73",
                    "pkValue74:skValue74",
                    "pkValue75:skValue75",
                    "pkValue76:skValue76",
                    "pkValue77:skValue77",
                    "pkValue78:skValue78",
                    "pkValue79:skValue79",
                    "pkValue8:skValue8",
                    "pkValue80:skValue80",
                    "pkValue81:skValue81",
                    "pkValue82:skValue82",
                    "pkValue83:skValue83",
                    "pkValue84:skValue84",
                    "pkValue85:skValue85",
                    "pkValue86:skValue86",
                    "pkValue87:skValue87",
                    "pkValue88:skValue88",
                    "pkValue89:skValue89",
                    "pkValue9:skValue9",
                    "pkValue90:skValue90",
                    "pkValue91:skValue91",
                    "pkValue92:skValue92",
                    "pkValue93:skValue93",
                    "pkValue94:skValue94",
                    "pkValue95:skValue95",
                    "pkValue96:skValue96",
                    "pkValue97:skValue97",
                    "pkValue98:skValue98",
                    "pkValue99:skValue99"
                ]
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
