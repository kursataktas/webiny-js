import { createContextPlugin, ICreateLoggerContextParams } from "./context";
import { createLifecycle } from "./lifecycle";

export const createLogger = (params?: ICreateLoggerContextParams) => {
    return [createLifecycle(), createContextPlugin(params)];
};
