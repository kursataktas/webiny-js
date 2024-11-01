import { ContextPlugin } from "@webiny/api";
import { Context } from "~/types";
import { createGraphQl } from "~/graphql";
import { loggerFactory } from "~/logger/factory";
import { createCrud } from "~/crud";

export const createLogger = () => {
    return new ContextPlugin<Context>(async context => {
        const getTenant = () => context.tenancy.getCurrentTenant().id;
        const getLocale = () => {
            const locale = context.i18n.getContentLocale();
            if (!locale) {
                throw new Error("Missing locale.");
            }
            return locale.code;
        };

        const { logger, storageOperations } = loggerFactory({
            context,
            getLocale,
            getTenant
        });

        context.logger = {
            log: logger,
            ...createCrud({
                storageOperations
            })
        };
        context.plugins.register([...createGraphQl()]);
    });
};
