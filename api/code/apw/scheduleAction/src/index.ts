const { CloudWatchEventsClient } = require("@aws-sdk/client-cloudwatch-events");
import { createHandler } from "@webiny/handler-aws";
import scheduleActionPlugins from "@webiny/api-apw/scheduler/handlers/scheduleAction";
import { createStorageOperations } from "@webiny/api-apw-scheduler-so-ddb";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import dbPlugins from "@webiny/handler-db";
import { DynamoDbDriver } from "@webiny/db-dynamodb";
import dynamoDbPlugins from "@webiny/db-dynamodb/plugins";
import logsPlugins from "@webiny/handler-logs";

const documentClient = new DocumentClient({
    convertEmptyValues: true,
    region: process.env.AWS_REGION
});

const debug = process.env.DEBUG === "true";

export const handler = createHandler({
    plugins: [
        dynamoDbPlugins(),
        logsPlugins(),
        dbPlugins({
            table: process.env.DB_TABLE,
            driver: new DynamoDbDriver({
                documentClient
            })
        }),
        scheduleActionPlugins({
            cwClient: new CloudWatchEventsClient({ region: process.env.AWS_REGION }),
            storageOperations: createStorageOperations({
                documentClient
            }),
            handlers: {
                executeAction: String(process.env.APW_SCHEDULER_EXECUTE_ACTION_HANDLER)
            }
        })
    ],
    http: { debug }
});
