import { makeAutoObservable } from "mobx";
import * as SelectPrimitive from "@radix-ui/react-select";
import omit from "lodash/omit";
import { SelectOptionsProps, SelectProps } from "./Select";

interface ISelectPresenter {
    vm: {
        selectVm: SelectPrimitive.SelectProps;
        selectTriggerVm: SelectPrimitive.SelectValueProps;
        selectOptionsVm: SelectOptionsProps;
    };
    init: (props: SelectProps) => void;
    changeValue: (value: string) => void;
}

class SelectPresenter implements ISelectPresenter {
    private props?: SelectProps;

    constructor() {
        this.props = undefined;
        makeAutoObservable(this);
    }

    init(props: SelectProps) {
        this.props = props;
    }

    get vm() {
        return {
            selectVm: {
                ...omit(this.props, ["placeholder", "options"]),
                options: this.options
            },
            selectTriggerVm: {
                placeholder: this.props?.placeholder || "Choose a value"
            },
            selectOptionsVm: {
                options: this.options
            }
        };
    }

    public changeValue = (value: string) => {
        this.props?.onValueChange(value);
    };

    private get options() {
        if (!this.props?.options) {
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
