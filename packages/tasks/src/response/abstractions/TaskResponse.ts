import { ITaskDataValues, TaskResponseStatus } from "~/types";
import { IResponseError } from "./ResponseErrorResult";

export type ITaskResponseResult =
    | ITaskResponseDoneResult
    | ITaskResponseContinueResult
    | ITaskResponseErrorResult
    | ITaskResponseAbortedResult;

export interface ITaskResponseDoneResult {
    message?: string;
    status: TaskResponseStatus.DONE;
}

export interface ITaskResponseContinueResult<T = ITaskDataValues> {
    values: T;
    status: TaskResponseStatus.CONTINUE;
}

export interface ITaskResponseErrorResult {
    error: IResponseError;
    status: TaskResponseStatus.ERROR;
}

export interface ITaskResponseAbortedResult {
    status: TaskResponseStatus.ABORTED;
}

export interface ITaskResponse<T = ITaskDataValues> {
    done: (message?: string) => ITaskResponseDoneResult;
    continue: (values: T) => ITaskResponseContinueResult<T>;
    error: (error: IResponseError) => ITaskResponseErrorResult;
    aborted: () => ITaskResponseAbortedResult;
}
