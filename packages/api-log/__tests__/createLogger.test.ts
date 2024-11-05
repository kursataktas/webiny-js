import { Context } from "~/types";
import { getDocumentClient } from "@webiny/project-utils/testing/dynamodb";
import { getTenant } from "~tests/mocks/getTenant";
import { getLocale } from "~tests/mocks/getLocale";
import { createLogger } from "~/index";
import { PluginsContainer } from "@webiny/plugins";

describe("createLogger", () => {
    const documentClient = getDocumentClient();

    it("should create logger context", async () => {
        const context: Context = {
            plugins: new PluginsContainer(),
            db: {
                driver: {
                    // @ts-expect-error
                    documentClient
                }
            },
            tenancy: {
                // @ts-expect-error
                getCurrentTenant: () => {
                    return { id: getTenant() };
                }
            },
            i18n: {
                // @ts-expect-error
                getContentLocale: () => {
                    return {
                        code: getLocale()
                    };
                }
            }
        };
        expect(context.logger).toBeUndefined();

        const plugins = createLogger();

        for (const plugin of plugins) {
            // @ts-expect-error
            if (!plugin.apply) {
                continue;
            }
            // @ts-expect-error
            await plugin.apply(context);
        }

        expect(context.logger).toBeDefined();
    });
});
