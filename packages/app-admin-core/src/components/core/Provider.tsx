import { useEffect } from "react";
import { HigherOrderComponent, useAdmin } from "~/index";

export interface ProviderProps {
    hoc: HigherOrderComponent;
}

/**
 * Register a new React context provider.
 *
 * @param hoc
 * @constructor
 */
export const Provider: React.FC<ProviderProps> = ({ hoc }) => {
    const { addProvider } = useAdmin();

    useEffect(() => {
        return addProvider(hoc);
    }, []);

    return null;
};
