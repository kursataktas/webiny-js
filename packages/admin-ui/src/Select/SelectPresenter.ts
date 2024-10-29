import { makeAutoObservable } from "mobx";
import * as SelectPrimitive from "@radix-ui/react-select";
import omit from "lodash/omit";
import { SelectOptionsProps, SelectProps } from "./Select";

interface ISelectPresenter {
    selectVm: SelectPrimitive.SelectProps;
    selectTriggerVm: SelectPrimitive.SelectValueProps;
    selectOptionsVm: SelectOptionsProps;
}

class SelectPresenter implements ISelectPresenter {
    constructor(private props: SelectProps) {
        makeAutoObservable(this);
    }

    get selectVm() {
        return {
            ...omit(this.props, ["placeholder", "options"]),
            options: this.options
        };
    }

    get selectTriggerVm() {
        return {
            placeholder: this.props.placeholder || "Choose a value"
        };
    }

    get selectOptionsVm() {
        return {
            options: this.options
        };
    }

    private get options() {
        if (!this.props.options) {
            return [];
        }

        const options = [];

        for (const option of this.props.options) {
            if (typeof option === "string") {
                options.push({
                    value: option,
                    label: option
                });
                continue;
            }
            options.push({
                label: option.label,
                value: option.value,
                options: option.options,
                disabled: option.disabled,
                separator: option.separator
            });
        }

        return options;
    }
}

export { SelectPresenter, type ISelectPresenter };
