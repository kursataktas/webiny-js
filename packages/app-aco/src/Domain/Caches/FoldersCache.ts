import { makeAutoObservable } from "mobx";
import { ICache } from "./ICache";
import { Folder } from "~/Domain/Models";

export class FoldersCache implements ICache<Folder> {
    private folders: Folder[];

    constructor() {
        this.folders = [];
        makeAutoObservable(this);
    }

    async get(): Promise<Folder[]> {
        return this.folders;
    }

    async set(item: Folder): Promise<void> {
        this.folders.push(item);
    }

    async setMultiple(items: Folder[]): Promise<void> {
        this.folders = items;
    }

    async update(id: string, item: Folder): Promise<void> {
        const folderIndex = this.folders.findIndex(f => f.id === id);

        if (folderIndex > -1) {
            this.folders[folderIndex] = {
                ...this.folders[folderIndex],
                ...item
            };
        }
    }

    async remove(id: string): Promise<void> {
        this.folders = this.folders.filter(folder => folder.id !== id);
    }
}
