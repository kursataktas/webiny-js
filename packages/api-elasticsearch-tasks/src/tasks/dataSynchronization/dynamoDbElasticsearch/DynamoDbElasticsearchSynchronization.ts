import { ITaskResponseResult } from "@webiny/tasks";
import {
    IDataSynchronizationManager,
    IDynamoDbElasticsearchSyncParams,
    ISynchronization,
    ISynchronizationRunResult
} from "../types";

export class DynamoDbElasticsearchSynchronization implements ISynchronization {
    private readonly manager: IDataSynchronizationManager;

    public constructor(params: IDynamoDbElasticsearchSyncParams) {
        this.manager = params.manager;
    }

    public async run(): Promise<ISynchronizationRunResult> {
        return this.manager.response.error(new Error("Not implemented"));
    }
}
