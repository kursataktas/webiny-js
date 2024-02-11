import React from "react";
import { Provider } from "./Provider";
import { Plugins } from "./Plugins";
import { GenericComponent, GenericDecorator } from "@webiny/react-composition";

interface PluginProps {
    providers?: GenericDecorator<GenericComponent>[];
    children?: React.ReactNode;
}

export const Plugin = React.memo(function Plugin({ providers, children }: PluginProps) {
    return (
        <>
            {(providers || []).map((provider, index) => (
                <Provider key={index} hoc={provider} />
            ))}
            {children ? <Plugins>{children}</Plugins> : null}
        </>
    );
});
