export interface IElasticsearchSynchronizeExecuteParamsItem {
    PK: string;
    SK: string;
    _id: string;
    index: string;
}

export interface IElasticsearchSynchronizeExecuteParams {
    done: boolean;
    index: string;
    items: IElasticsearchSynchronizeExecuteParamsItem[];
    skipDryRun: boolean;
}

export interface IElasticsearchSynchronizeExecuteResponseKey {
    index: string;
    id: string;
}

export interface IElasticsearchSynchronizeExecuteResponse {
    done: boolean;
    keys: IElasticsearchSynchronizeExecuteResponseKey[] | undefined;
}
export interface IElasticsearchSynchronize {
    execute(
        params: IElasticsearchSynchronizeExecuteParams
    ): Promise<IElasticsearchSynchronizeExecuteResponse>;
}
