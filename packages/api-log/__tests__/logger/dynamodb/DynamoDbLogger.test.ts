import { createDynamoDbLogger } from "~/logger";
import { getTenant } from "~tests/mocks/getTenant";
import { getLocale } from "~tests/mocks/getLocale";
import { ILoggerLog, LogType } from "~/types";

describe("DynamoDbLogger", () => {
    it("should one log per type log", async () => {
        const logs: ILoggerLog[] = [];

        const onFlush = async (items: ILoggerLog[]): Promise<ILoggerLog[]> => {
            logs.push(...items);
            return items;
        };

        const tenant = getTenant();
        const locale = getLocale();

        const logger = createDynamoDbLogger({
            onFlush,
            getLocale,
            getTenant
        });

        logger.debug("source1", "log1");
        logger.info("source2", "log2");
        logger.warn("source3", "log3");
        logger.notice("source4", "log4");
        logger.error("source5", "log5");

        await logger.flush();

        expect(logs).toEqual([
            {
                id: expect.any(String),
                createdOn: expect.toBeDateString(),
                source: "source1",
                data: "log1",
                tenant,
                locale,
                type: LogType.DEBUG
            },
            {
                id: expect.any(String),
                createdOn: expect.toBeDateString(),
                source: "source2",
                data: "log2",
                tenant,
                locale,
                type: LogType.INFO
            },
            {
                id: expect.any(String),
                createdOn: expect.toBeDateString(),
                source: "source3",
                data: "log3",
                tenant,
                locale,
                type: LogType.WARN
            },
            {
                id: expect.any(String),
                createdOn: expect.toBeDateString(),
                source: "source4",
                data: "log4",
                tenant,
                locale,
                type: LogType.NOTICE
            },
            {
                id: expect.any(String),
                createdOn: expect.toBeDateString(),
                source: "source5",
                data: "log5",
                tenant,
                locale,
                type: LogType.ERROR
            }
        ]);
        /**
         * Make sure all types of logs are represented.
         */
        const types = Object.values(LogType);
        expect(types.length).toBeGreaterThan(1);
        for (const type of types) {
            expect(logs.filter(log => log.type === type)).toHaveLength(1);
        }
    });
});
