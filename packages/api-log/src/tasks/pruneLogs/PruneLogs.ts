import { ITaskResponseResult, ITaskRunParams } from "@webiny/tasks";
import { Context, IPruneLogsInput, IPruneLogsOutput } from "~/tasks/pruneLogs/types";
import { create } from "~/db";
import { ILoggerCrudListLogsResponse, ILoggerLog } from "~/types";
import { batchWriteAll } from "@webiny/db-dynamodb";
import { DynamoDbLoggerKeys } from "~/logger";

const getDate = (input: string | undefined, reduceSeconds = 60): Date => {
    if (input) {
        return new Date(input);
    }
    const current = new Date().getTime();
    const next = current - reduceSeconds * 1000;
    return new Date(next);
};

export class PruneLogs<C extends Context, I extends IPruneLogsInput, O extends IPruneLogsOutput> {
    private readonly keys: DynamoDbLoggerKeys;

    public constructor() {
        this.keys = new DynamoDbLoggerKeys();
    }

    public async execute(params: ITaskRunParams<C, I, O>): Promise<ITaskResponseResult> {
        const { context, response, input, isAborted, isCloseToTimeout } = params;

        const { entity, table } = create({
            // @ts-expect-error
            documentClient: context.db.driver.documentClient
        });

        let startKey = input.keys || undefined;

        const deleteAfter = getDate(input.createdOn);

        const isDeletable = (item: Pick<ILoggerLog, "createdOn">): boolean => {
            const date = new Date(item.createdOn);
            return date.getTime() < deleteAfter.getTime();
        };

        let result: ILoggerCrudListLogsResponse;
        do {
            if (isAborted()) {
                return response.aborted();
            } else if (isCloseToTimeout()) {
                return response.continue({
                    ...input,
                    keys: startKey
                });
            }
            result = await context.logger.listLogs({
                where: {
                    tenant: input.tenant,
                    source: input.source,
                    type: input.type
                },
                limit: 100
            });

            const items = result.items.filter(isDeletable);

            if (items.length > 0) {
                await batchWriteAll({
                    items: result.items.map(item => {
                        return entity.deleteBatch({
                            PK: this.keys.createPartitionKey(),
                            SK: this.keys.createSortKey(item)
                        });
                    }),
                    table
                });
            }

            if (result?.meta?.hasMoreItems) {
                startKey = result.meta.cursor || undefined;
            }
        } while (startKey);

        return response.done();
    }
}
