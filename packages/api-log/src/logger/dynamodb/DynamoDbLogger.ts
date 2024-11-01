import { ILogger, ILoggerLog, LogType } from "~/types";
import { GenericRecord } from "@webiny/api/types";
import { mdbid } from "@webiny/utils";

interface IDynamoDbLoggerAddParams<T = GenericRecord> {
    source: string;
    data: T;
    type: LogType;
}

export interface IDynamoDbLoggerParamsOnFlushCallable {
    (items: ILoggerLog[]): Promise<ILoggerLog[]>;
}

export interface IDynamoDbLoggerParams {
    readonly getTenant: () => string;
    readonly getLocale: () => string;
    readonly onFlush: IDynamoDbLoggerParamsOnFlushCallable;
}

export class DynamoDbLogger implements ILogger {
    private readonly items = new Set<ILoggerLog>();
    private readonly getTenant: () => string;
    private readonly getLocale: () => string;
    private readonly onFlush: IDynamoDbLoggerParamsOnFlushCallable;

    public constructor(params: IDynamoDbLoggerParams) {
        this.getTenant = params.getTenant;
        this.getLocale = params.getLocale;
        this.onFlush = params.onFlush;
    }
    public debug<T = GenericRecord>(source: string, data: T): void {
        return this.add<T>({
            data,
            source,
            type: LogType.DEBUG
        });
    }

    public info<T = GenericRecord>(source: string, data: T): void {
        return this.add<T>({
            data,
            source,
            type: LogType.INFO
        });
    }

    public warn<T = GenericRecord>(source: string, data: T): void {
        return this.add<T>({
            data,
            source,
            type: LogType.WARN
        });
    }

    public notice<T = GenericRecord>(source: string, data: T): void {
        return this.add<T>({
            data,
            source,
            type: LogType.NOTICE
        });
    }

    public error<T = GenericRecord>(source: string, data: T): void {
        return this.add<T>({
            data,
            source,
            type: LogType.ERROR
        });
    }

    public async flush(): Promise<ILoggerLog[]> {
        const items = Array.from(this.items);
        this.items.clear();
        return await this.onFlush(items);
    }

    private add<T = GenericRecord>(params: IDynamoDbLoggerAddParams<T>): void {
        this.items.add({
            id: mdbid(),
            createdOn: new Date().toISOString(),
            tenant: this.getTenant(),
            locale: this.getLocale(),
            data: params.data,
            source: params.source,
            type: params.type
        });
    }
}

export const createDynamoDbLogger = (params: IDynamoDbLoggerParams): ILogger => {
    return new DynamoDbLogger(params);
};
