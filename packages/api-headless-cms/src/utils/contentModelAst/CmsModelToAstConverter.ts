import { CmsModel, CmsModelAstTree, CmsModelFieldAstNode, ICmsModelFieldToAst } from "~/types";

/**
 * The purpose of this class is to convert the given CmsModel to an AST, which is easier to traverse programmatically.
 * Using this, we can get information about the structure of the model fields, without understanding how each
 * individual model field stores its internal data. This is particularly useful for fields like `dynamicZone` and `object`.
 */

export class CmsModelToAstConverter {
    private readonly fieldToAstConverter: ICmsModelFieldToAst;

    constructor(fieldToAstConverter: ICmsModelFieldToAst) {
        this.fieldToAstConverter = fieldToAstConverter;
    }

    toAst(model: CmsModel): CmsModelAstTree {
        return {
            type: "root",
            children: model.fields.reduce<CmsModelFieldAstNode[]>((ast, field) => {
                return [...ast, this.fieldToAstConverter.toAst(field)];
            }, [])
        };
    }
}
