import { CmsIdentity, FolderPermission } from "~/types";

export interface FolderDto {
    id: string;
    title: string;
    slug: string;
    permissions: FolderPermission[];
    hasNonInheritedPermissions: boolean;
    canManagePermissions: boolean;
    canManageStructure: boolean;
    canManageContent: boolean;
    type: string;
    parentId: string | null;
    createdBy: CmsIdentity;
    createdOn: string;
    savedBy: CmsIdentity;
    savedOn: string;
    modifiedBy: CmsIdentity | null;
    modifiedOn: string | null;
}

export interface IListFoldersGateway {
    execute: (type: string) => Promise<FolderDto[]>;
}
