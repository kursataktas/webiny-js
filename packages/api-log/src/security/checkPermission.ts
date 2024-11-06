import { Context } from "~/types";
import { NotAuthorizedError } from "@webiny/api-security";

export interface ICheckPermissionFactoryParams {
    getContext(): Pick<Context, "security">;
}

export const checkPermissionFactory = (params: ICheckPermissionFactoryParams) => {
    return async () => {
        const permission = await params.getContext().security.getPermission("logs");
        if (permission) {
            return;
        }
        throw new NotAuthorizedError();
    };
};
