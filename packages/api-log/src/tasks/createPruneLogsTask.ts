import { createTaskDefinition } from "@webiny/tasks";
import { Context, IPruneLogsInput, IPruneLogsOutput } from "~/tasks/pruneLogs/types";
import { LogType } from "~/types";
import { NonEmptyArray } from "@webiny/api/types";

export const PRUNE_LOGS_TASK = "pruneLogs";

export const createPruneLogsTask = () => {
    return createTaskDefinition<Context, IPruneLogsInput, IPruneLogsOutput>({
        id: PRUNE_LOGS_TASK,
        maxIterations: 5,
        disableDatabaseLogs: true,
        isPrivate: false,
        description: "Prune logs from the database, but keep the ones created in last 1 minute.",
        title: "Prune Logs",
        run: async params => {
            const { PruneLogs } = await import(
                /* webpackChunkName: "PruneLogs" */ "./pruneLogs/PruneLogs"
            );

            try {
                const prune = new PruneLogs();
                return await prune.execute(params);
            } catch (ex) {
                console.log("Error executing the task.", ex);
                return params.response.error({
                    message: ex.message,
                    code: ex.code || "PRUNE_LOGS_TASK_ERROR",
                    data: ex.data
                });
            }
        },
        createInputValidation: ({ validator }) => {
            return {
                tenant: validator.string().optional(),
                source: validator.string().optional(),
                keys: validator.object({}).passthrough(),
                type: validator.enum(Object.keys(LogType) as NonEmptyArray<LogType>).optional(),
                createdOn: validator
                    .string()
                    .optional()
                    .transform(value => {
                        return value;
                    })
            };
        }
    });
};
