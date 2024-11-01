import {
    Context,
    ILoggerCrud,
    ILoggerCrudDeleteLogParams,
    ILoggerCrudDeleteLogResponse,
    ILoggerCrudDeleteLogsParams,
    ILoggerCrudGetLogResponse,
    ILoggerCrudGetLogsParams,
    ILoggerCrudListLogsParams,
    ILoggerCrudListLogsResponse,
    ILoggerLog,
    ILoggerStorageOperations,
    ILoggerWithSource
} from "~/types";
import { NotFoundError } from "@webiny/handler-graphql";

export interface ICreateCrudParams {
    storageOperations: ILoggerStorageOperations;
}

export const createCrud = (params: ICreateCrudParams): ILoggerCrud => {
    const { storageOperations } = params;
    return {
        async getLog(params: ILoggerCrudGetLogsParams): Promise<ILoggerCrudGetLogResponse> {
            const item = await storageOperations.getLog(params);
            if (!item) {
                throw new NotFoundError();
            }
            return {
                item
            };
        },
        async deleteLog(params: ILoggerCrudDeleteLogParams): Promise<ILoggerCrudDeleteLogResponse> {
            const item = await storageOperations.deleteLog({
                ...params
            });
            if (!item) {
                throw new NotFoundError();
            }
            return {
                item
            };
        },
        async deleteLogs(params: ILoggerCrudDeleteLogsParams): Promise<ILoggerLog[]> {
            return storageOperations.deleteLogs(params);
        },
        async listLogs(params: ILoggerCrudListLogsParams): Promise<ILoggerCrudListLogsResponse> {
            const { items, meta } = await storageOperations.listLogs(params);
            return {
                items,
                meta
            };
        },
        withSource(this: Context["logger"], source: string): ILoggerWithSource {
            return {
                info: data => {
                    return this.log.info(source, data);
                },
                notice: data => {
                    return this.log.notice(source, data);
                },
                debug: data => {
                    return this.log.debug(source, data);
                },
                warn: data => {
                    return this.log.warn(source, data);
                },
                error: data => {
                    return this.log.error(source, data);
                },
                flush: () => {
                    return this.log.flush();
                }
            };
        }
    };
};
