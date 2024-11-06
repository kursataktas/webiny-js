import { createModifyFastifyPlugin } from "@webiny/handler";
import { Context } from "./types";

export const createLifecycle = () => {
    return createModifyFastifyPlugin(app => {
        app.addHook("onResponse", async () => {
            /**
             * We will run this in the background, so we don't block the request.
             */
            (async () => {
                const context = app.webiny as Context;
                try {
                    await context.logger.log.flush();
                } catch (ex) {
                    console.error("Error flushing logs.");
                    console.log(ex);
                }
            })();
        });
    });
};
