import { Entity } from "@webiny/db-dynamodb/toolbox";
import { NonEmptyArray } from "@webiny/api/types";
import { IRegistryItem } from "@webiny/db";
import { EntityType } from "./getElasticsearchEntityTypeByIndex";
import { Context } from "~/types";

export interface IGetRegularEntityParams {
    type: EntityType | unknown;
    context: Context;
    tags?: string[];
}

const createPredicate = (app: string, tags: NonEmptyArray<string>) => {
    return (item: IRegistryItem) => {
        return item.app === app && tags.every(tag => item.tags.includes(tag));
    };
};

export const getRegularEntity = (params: IGetRegularEntityParams): IRegistryItem<Entity> | null => {
    const { type, context, tags = [] } = params;

    const getByPredicate = (predicate: (item: IRegistryItem<Entity>) => boolean) => {
        return context.db.registry.getItem<Entity>(predicate);
    };

    switch (type) {
        case EntityType.CMS:
            return getByPredicate(createPredicate("cms", ["regular", ...tags]));
        case EntityType.PAGE_BUILDER:
            return getByPredicate(createPredicate("pb", ["regular", ...tags]));
        case EntityType.FORM_BUILDER:
            return getByPredicate(createPredicate("fb", ["regular", ...tags]));
        case EntityType.FORM_BUILDER_SUBMISSION:
            return getByPredicate(createPredicate("fb", ["regular", "form-submission", ...tags]));
    }
    return null;
};

export interface IListRegularEntitiesParams {
    context: Pick<Context, "db">;
}

export const listRegularEntities = (
    params: IListRegularEntitiesParams
): IRegistryItem<Entity>[] => {
    const { context } = params;

    return context.db.registry.getItems<Entity>(item => {
        return item.tags.includes("regular");
    });
};
