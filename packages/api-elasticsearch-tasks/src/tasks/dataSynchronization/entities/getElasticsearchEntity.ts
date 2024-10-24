import { Entity } from "@webiny/db-dynamodb/toolbox";
import { NonEmptyArray } from "@webiny/api/types";
import { IRegistryItem } from "@webiny/db";
import { EntityType } from "./getElasticsearchEntityTypeByIndex";
import { Context } from "~/types";

export interface IGetElasticsearchEntityParams {
    type: EntityType | unknown;
    context: Pick<Context, "db">;
}

const createPredicate = (app: string, tags: NonEmptyArray<string>) => {
    return (item: IRegistryItem) => {
        return item.app === app && tags.every(tag => item.tags.includes(tag));
    };
};

export const getElasticsearchEntity = (
    params: IGetElasticsearchEntityParams
): IRegistryItem<Entity> | null => {
    const { type, context } = params;

    const getByPredicate = (predicate: (item: IRegistryItem) => boolean) => {
        return context.db.registry.getItem<Entity>(predicate);
    };

    switch (type) {
        case EntityType.CMS:
            return getByPredicate(createPredicate("cms", ["es"]));
        case EntityType.PAGE_BUILDER:
            return getByPredicate(createPredicate("pb", ["es"]));
        case EntityType.FORM_BUILDER:
            return getByPredicate(createPredicate("fb", ["es"]));
        case EntityType.FORM_BUILDER_SUBMISSION:
            return getByPredicate(createPredicate("fb", ["es", "form-submission"]));
    }
    return null;
};

export interface IListElasticsearchEntitiesParams {
    context: Pick<Context, "db">;
}

export const listElasticsearchEntities = (
    params: IListElasticsearchEntitiesParams
): IRegistryItem<Entity>[] => {
    const { context } = params;

    return context.db.registry.getItems<Entity>(item => {
        return item.tags.includes("es");
    });
};
