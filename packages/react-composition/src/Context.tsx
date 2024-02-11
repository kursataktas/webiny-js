import React, {
    ComponentType,
    useState,
    useCallback,
    createContext,
    useContext,
    useMemo
} from "react";
import { useCompositionScope } from "~/CompositionScope";
import {
    ComposedFunction,
    ComposeWith,
    DecoratableComponent,
    DecoratableHook,
    Enumerable,
    GenericComponent,
    GenericHook
} from "~/types";

export function compose<T>(...fns: GenericDecorator<T>[]) {
    return (decoratee: T): T => {
        return fns.reduceRight((decoratee, decorator) => decorator(decoratee), decoratee);
    };
}

interface ComposedComponent {
    /**
     * Ready to use React component.
     */
    component: GenericHook | GenericComponent;
    /**
     * HOCs used to compose the original component.
     */
    hocs: GenericDecorator<GenericComponent | GenericHook>[];
    /**
     * Component composition can be scoped.
     */
    scope?: string;
}

export type GenericDecorator<T> = (decoratee: T) => T;

/**
 * IMPORTANT: TProps default type is `any` because this interface is use as a prop type in the `Compose` component.
 * You can pass any Decorator as a prop, regardless of its TProps type. The only way to allow that is
 * to let it be `any` in this interface.
 */
export interface Decorator<T extends DecoratableHook | DecoratableComponent> {
    (decoratee: T): T;
}

/**
 * @deprecated Use `Decorator` instead.
 */
export interface HigherOrderComponent<TProps = any, TOutput = TProps> {
    (Component: GenericComponent<TProps>): GenericComponent<TOutput>;
}

type ComposedComponents = Map<ComponentType<unknown>, ComposedComponent>;
type ComponentScopes = Map<string, ComposedComponents>;

export type DecoratableTypes = DecoratableComponent | DecoratableHook;

interface CompositionContext {
    components: ComponentScopes;
    getComponent(component: ComponentType<unknown>, scope?: string): ComposedFunction | undefined;
    composeComponent(
        component: ComponentType<unknown>,
        hocs: Enumerable<ComposeWith>,
        scope?: string
    ): void;
}

const CompositionContext = createContext<CompositionContext | undefined>(undefined);

interface CompositionProviderProps {
    children: React.ReactNode;
}

export const CompositionProvider = ({ children }: CompositionProviderProps) => {
    const [components, setComponents] = useState<ComponentScopes>(new Map());

    const composeComponent = useCallback(
        (component, hocs, scope = "*") => {
            setComponents(prevComponents => {
                const components = new Map(prevComponents);
                const scopeMap: ComposedComponents = components.get(scope) || new Map();
                const recipe = scopeMap.get(component) || { component: null, hocs: [] };

                const newHocs = [...(recipe.hocs || []), ...hocs] as GenericDecorator<
                    GenericHook | GenericComponent
                >[];

                scopeMap.set(component, {
                    component: compose(...[...newHocs].reverse())(component),
                    hocs: newHocs
                });

                components.set(scope, scopeMap);
                return components;
            });

            // Return a function that will remove the added HOCs.
            return () => {
                setComponents(prevComponents => {
                    const components = new Map(prevComponents);
                    const scopeMap: ComposedComponents = components.get(scope) || new Map();
                    const recipe = scopeMap.get(component) || {
                        component: null,
                        hocs: []
                    };

                    const newHOCs = [...recipe.hocs].filter(hoc => !hocs.includes(hoc));
                    const NewComponent = compose(...[...newHOCs].reverse())(component);

                    scopeMap.set(component, {
                        component: NewComponent,
                        hocs: newHOCs
                    });

                    components.set(scope, scopeMap);
                    return components;
                });
            };
        },
        [setComponents]
    );

    const getComponent: CompositionContext["getComponent"] = useCallback(
        (Component, scope = "*") => {
            const scopeMap: ComposedComponents = components.get(scope) || new Map();
            const composedComponent = scopeMap.get(Component);
            if (!composedComponent && scope !== "*") {
                // Check if a default scope component exists
                const defaultScopeMap: ComposedComponents = components.get("*") || new Map();
                const defaultComponent = defaultScopeMap.get(Component);
                return defaultComponent ? defaultComponent.component : undefined;
            }
            return composedComponent ? composedComponent.component : undefined;
        },
        [components]
    );

    const context: CompositionContext = useMemo(
        () => ({
            getComponent,
            composeComponent,
            components
        }),
        [components, composeComponent]
    );

    return <CompositionContext.Provider value={context}>{children}</CompositionContext.Provider>;
};

export function useComponent<T>(baseFunction: T) {
    const context = useOptionalComposition();
    const scope = useCompositionScope();

    if (!context) {
        return baseFunction;
    }

    return (context.getComponent(baseFunction as any, scope) || baseFunction) as T;
}

/**
 * This hook will throw an error if composition context doesn't exist.
 */
export function useComposition() {
    const context = useContext(CompositionContext);
    if (!context) {
        throw new Error(
            `You're missing a <CompositionProvider> higher up in your component hierarchy!`
        );
    }

    return context;
}

/**
 * This hook will not throw an error if composition context doesn't exist.
 */
export function useOptionalComposition() {
    return useContext(CompositionContext);
}
