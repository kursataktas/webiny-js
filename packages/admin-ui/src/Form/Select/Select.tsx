import React from "react";
import { makeDecoratable } from "@webiny/react-composition";
import {
    SelectRenderer as BaseSelectRenderer,
    SelectProps as BaseSelectProps,
    SelectOptionsVm,
    SelectTriggerVm,
    SelectVm
} from "~/Select";
import { Label } from "~/Label";
import { useSelect } from "./useSelect";

type SelectLabelVm = {
    label: React.ReactNode;
};

interface SelectRendererProps {
    selectVm: SelectVm;
    selectTriggerVm: SelectTriggerVm;
    selectOptionsVm: SelectOptionsVm;
    selectLabelVm: SelectLabelVm;
    onValueChange: (values: string) => void;
}

const DecoratableFormSelectRenderer = ({
    selectVm,
    selectTriggerVm,
    selectOptionsVm,
    selectLabelVm,
    onValueChange
}: SelectRendererProps) => {
    return (
        <>
            <Label text={selectLabelVm.label} />
            <BaseSelectRenderer
                selectVm={selectVm}
                selectTriggerVm={selectTriggerVm}
                selectOptionsVm={selectOptionsVm}
                onValueChange={onValueChange}
            />
        </>
    );
};

const SelectRenderer = makeDecoratable("SelectRenderer", DecoratableFormSelectRenderer);

/**
 * Select
 */
interface SelectProps extends BaseSelectProps {
    label: SelectLabelVm["label"];
}
const DecoratableFormSelect = (props: SelectProps) => {
    const { vm, changeValue } = useSelect(props);

    return (
        <SelectRenderer
            selectVm={vm.selectVm}
            selectTriggerVm={vm.selectTriggerVm}
            selectOptionsVm={vm.selectOptionsVm}
            selectLabelVm={vm.selectLabelVm}
            onValueChange={changeValue}
        />
    );
};

const Select = makeDecoratable("Select", DecoratableFormSelect);

export { Select, type SelectProps, type SelectLabelVm };
