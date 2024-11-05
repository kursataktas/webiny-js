import { TenancyContext } from "@webiny/api-tenancy/types";
import { I18NContext } from "@webiny/api-i18n/types";
import { GenericRecord } from "@webiny/api/types";

export interface ILoggerLogCallableOptions {
    tenant?: string;
    locale?: string;
}
export interface ILoggerLogCallable {
    (source: string, data: unknown, options?: ILoggerLogCallableOptions): void;
}

export enum LogType {
    DEBUG = "debug",
    NOTICE = "notice",
    INFO = "info",
    WARN = "warn",
    ERROR = "error"
}

export interface ILoggerLog {
    id: string;
    createdOn: string;
    tenant: string;
    locale: string;
    source: string;
    type: string;
    data: unknown;
}

export interface ILoggerCrudListLogsParamsWhere {
    tenant?: string;
    source?: string;
    type?: LogType;
}

export type ILoggerCrudListSort = "ASC" | "DESC";

export interface ILoggerCrudListLogsParams {
    where?: ILoggerCrudListLogsParamsWhere;
    sort?: ILoggerCrudListSort[];
    limit?: number;
    after?: string;
}

export interface ILoggerCrudListLogsResponse {
    items: ILoggerLog[];
    meta: {
        cursor: string | null;
        totalCount: number;
        hasMoreItems: boolean;
    };
}

export interface ILoggerCrudGetLogsParamsWhere {
    id: string;
    tenant?: string;
}

export interface ILoggerCrudGetLogsParams {
    where: ILoggerCrudGetLogsParamsWhere;
}

export interface ILoggerCrudGetLogResponse {
    item: ILoggerLog;
}

export interface ILoggerCrudDeleteLogResponse {
    item: ILoggerLog;
}

export interface ILoggerCrudDeleteLogParamsWhere {
    tenant?: string;
    id: string;
}

export interface ILoggerCrudDeleteLogParams {
    where: ILoggerCrudDeleteLogParamsWhere;
}

export interface ILoggerCrudDeleteLogsParamsWhere {
    tenant?: string;
    items: string[];
}

export interface ILoggerCrudDeleteLogsParams {
    where: ILoggerCrudDeleteLogsParamsWhere;
}

export interface ILoggerWithSourceLogCallable {
    (data: GenericRecord): void;
}

export interface ILoggerWithSource {
    info: ILoggerWithSourceLogCallable;
    notice: ILoggerWithSourceLogCallable;
    debug: ILoggerWithSourceLogCallable;
    warn: ILoggerWithSourceLogCallable;
    error: ILoggerWithSourceLogCallable;
    flush(): Promise<ILoggerLog[]>;
}

export interface ILoggerCrud {
    withSource(source: string): ILoggerWithSource;
    listLogs(params: ILoggerCrudListLogsParams): Promise<ILoggerCrudListLogsResponse>;
    getLog(params: ILoggerCrudGetLogsParams): Promise<ILoggerCrudGetLogResponse>;
    deleteLog(params: ILoggerCrudDeleteLogParams): Promise<ILoggerCrudDeleteLogResponse>;
    deleteLogs(params: ILoggerCrudDeleteLogsParams): Promise<ILoggerLog[]>;
}

export interface ILoggerStorageOperationsInsertParams {
    items: ILoggerLog[];
}

export interface ILoggerStorageOperations {
    insert(params: ILoggerStorageOperationsInsertParams): Promise<ILoggerLog[]>;
    listLogs(params: ILoggerCrudListLogsParams): Promise<ILoggerCrudListLogsResponse>;
    getLog(params: ILoggerCrudGetLogsParams): Promise<ILoggerLog | null>;
    deleteLog(params: ILoggerCrudDeleteLogParams): Promise<ILoggerLog | null>;
    deleteLogs(params: ILoggerCrudDeleteLogsParams): Promise<ILoggerLog[]>;
}

export interface ILogger {
    debug: ILoggerLogCallable;
    info: ILoggerLogCallable;
    warn: ILoggerLogCallable;
    notice: ILoggerLogCallable;
    error: ILoggerLogCallable;
    flush(): Promise<ILoggerLog[]>;
}

export interface Context extends TenancyContext, I18NContext {
    logger: ILoggerCrud & {
        log: ILogger;
    };
}
