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

export interface IElasticsearchSynchronizeExecuteResponse {
    done: boolean;
    keys: string[];
}
export interface IElasticsearchSynchronize {
    execute(
        params: IElasticsearchSynchronizeExecuteParams
    ): Promise<IElasticsearchSynchronizeExecuteResponse>;
}
