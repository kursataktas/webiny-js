import { Context as TaskContext, ITaskResponseDoneResultOutput } from "@webiny/tasks";
import { Context as LoggerContext, LogType } from "~/types";

export interface IPruneLogsInput {
    tenant?: string;
    source?: string;
    type?: LogType;
    createdOn?: string;
    keys?: string;
}

export type IPruneLogsOutput = ITaskResponseDoneResultOutput;

export interface Context extends LoggerContext, TaskContext {}
