import { IconRepository, IconDTO } from "~/components/IconPicker/new/domain";

export interface IconPickerConfig {
    icons: IconDTO[];
    initialize: () => Promise<void>;
    isLoading: boolean;
}

class IconRepositoryFactory {
    private cache: Map<string, IconRepository> = new Map();

    getRepository(config: IconPickerConfig, namespace: string) {
        if (!this.cache.has(namespace)) {
            this.cache.set(namespace, new IconRepository(config, namespace));
        }

        const repository = this.cache.get(namespace) as IconRepository;

        // We can trigger repository.initialize() here.

        repository.config.initialize();

        if (!config.isLoading) {
            repository.config = config;
            this.cache.set(namespace, repository);
        }

        return repository;
    }
}

export const iconRepositoryFactory = new IconRepositoryFactory();
