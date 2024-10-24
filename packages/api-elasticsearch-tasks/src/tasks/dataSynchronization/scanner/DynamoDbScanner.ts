import { TableDef } from "@webiny/db-dynamodb/toolbox";
import { scan } from "~/helpers/scan";
import { ScanResponse } from "@webiny/db-dynamodb";

export type Attribute<T> = keyof T;

export type Attributes<T> = Attribute<T>[];

export interface IDynamoDbScannerParams<T> {
    table: TableDef;
    attributes?: Attributes<T>;
}

export interface IDynamoDbScannerScanParamsKeys {
    PK: string;
    SK: string;
}

export interface IDynamoDbScannerScanParams {
    keys?: IDynamoDbScannerScanParamsKeys;
    limit?: number;
}

export class DynamoDbScanner<T> {
    private readonly table: TableDef;
    private readonly attributes?: Attributes<T>;

    public constructor(params: IDynamoDbScannerParams<T>) {
        this.table = params.table;
        this.attributes = params.attributes;
    }

    public async scan(params?: IDynamoDbScannerScanParams): Promise<ScanResponse<T> | null> {
        const result = await scan({
            table: this.table,
            keys: params?.keys,
            options: {
                limit: params?.limit || 100,
                attributes: this.attributes
            }
        });
        if (result.items.length > 0) {
            return result;
        }
        return null;
    }
}
