import { makeAutoObservable } from "mobx";
import {
    Field,
    FieldDTO,
    FieldMapper,
    FieldRaw,
    Operation,
    QueryObject,
    QueryObjectDTO,
    QueryObjectMapper
} from "../domain";

export interface IQueryBuilderPresenter {
    getViewModel: () => QueryBuilderViewModel;
    addGroup: () => void;
    deleteGroup: (groupIndex: number) => void;
    addNewFilterToGroup: (groupIndex: number) => void;
    deleteFilterFromGroup: (groupIndex: number, filterIndex: number) => void;
    emptyFilterIntoGroup: (groupIndex: number, filterIndex: number) => void;
    setQueryObject: (queryObject: QueryObjectDTO) => void;
    onSubmit: (queryObject: QueryObjectDTO, onSuccess?: () => void, onError?: () => void) => void;
}

export interface QueryBuilderViewModel {
    queryObject: QueryObjectDTO;
    fields: FieldDTO[];
    invalidFields: Record<string, { isValid: boolean; message: string }>;
}

export class QueryBuilderPresenter implements IQueryBuilderPresenter {
    private queryObject: QueryBuilderViewModel["queryObject"];
    private readonly fields: QueryBuilderViewModel["fields"];
    private invalidFields: QueryBuilderViewModel["invalidFields"] = {};
    private formWasSubmitted = false;

    constructor(fields: FieldRaw[]) {
        this.queryObject = QueryObjectMapper.toDTO(QueryObject.createEmpty());
        this.fields = FieldMapper.toDTO(fields.map(field => Field.createFromRaw(field)));
        makeAutoObservable(this);
    }

    getViewModel(): QueryBuilderViewModel {
        return {
            queryObject: this.queryObject,
            fields: this.fields,
            invalidFields: this.invalidFields
        };
    }

    addGroup() {
        this.queryObject.groups.push({
            operation: Operation.AND,
            filters: [{ field: "", value: "", condition: "" }]
        });
    }

    deleteGroup(groupIndex: number) {
        this.queryObject.groups = this.queryObject.groups.filter(
            (_, index) => index !== groupIndex
        );

        // Make sure we always have at least 1 group!
        if (this.queryObject.groups.length === 0) {
            this.queryObject.groups.push({
                operation: Operation.AND,
                filters: [{ field: "", value: "", condition: "" }]
            });
        }
    }

    addNewFilterToGroup(groupIndex: number) {
        this.queryObject.groups[groupIndex].filters.push({
            field: "",
            value: "",
            condition: ""
        });
    }

    deleteFilterFromGroup(groupIndex: number, filterIndex: number) {
        const filters = this.queryObject.groups[groupIndex].filters;
        this.queryObject.groups[groupIndex].filters = filters.filter(
            (_, index) => index !== filterIndex
        );

        // Make sure we always have at least 1 filter!
        if (this.queryObject.groups[groupIndex].filters.length === 0) {
            this.queryObject.groups[groupIndex].filters.push({
                field: "",
                value: "",
                condition: ""
            });
        }
    }

    emptyFilterIntoGroup(groupIndex: number, filterIndex: number) {
        this.queryObject.groups[groupIndex].filters = [
            ...this.queryObject.groups[groupIndex].filters.slice(0, filterIndex),
            {
                field: "",
                value: "",
                condition: ""
            },
            ...this.queryObject.groups[groupIndex].filters.slice(filterIndex + 1)
        ];
    }

    setQueryObject(queryObject: QueryObjectDTO) {
        this.queryObject = queryObject;
        if (this.formWasSubmitted) {
            this.validateQueryObject(queryObject);
        }
    }

    onSubmit(queryObject: QueryObjectDTO, onSuccess?: () => void, onError?: () => void) {
        this.formWasSubmitted = true;
        const result = this.validateQueryObject(queryObject);
        if (result.success) {
            onSuccess && onSuccess();
        } else {
            onError && onError();
        }
    }

    private validateQueryObject(data: QueryObjectDTO) {
        const validation = QueryObject.validate(data);

        if (!validation.success) {
            this.invalidFields = validation.error.issues.reduce((acc, issue) => {
                return {
                    ...acc,
                    [issue.path.join(".")]: issue.message
                };
            }, {});
        } else {
            this.invalidFields = {};
        }

        return validation;
    }
}
