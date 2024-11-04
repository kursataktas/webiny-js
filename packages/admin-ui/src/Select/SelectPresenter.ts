import { makeAutoObservable } from "mobx";
import * as SelectPrimitive from "@radix-ui/react-select";
import omit from "lodash/omit";
import { SelectOptionsProps, SelectProps } from "./Select";
import { SelectOption } from "./SelectOption";
import { SelectOptionMapper } from "~/Select/SelectOptionMapper";

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
    private options?: SelectOption[];

    constructor() {
        this.props = undefined;
        makeAutoObservable(this);
    }

    init(props: SelectProps) {
        this.props = props;
        this.options = this.transformOptions(props.options);
    }

    get vm() {
        return {
            selectVm: {
                ...omit(this.props, ["placeholder", "options"])
            },
            selectTriggerVm: {
                placeholder: this.props?.placeholder || "Choose a value"
            },
            selectOptionsVm: {
                options: this.options?.map(option => SelectOptionMapper.toFormatted(option)) ?? []
            }
        };
    }

    public changeValue = (value: string) => {
        this.props?.onValueChange(value);
    };

    private transformOptions(options: SelectProps["options"]): SelectOption[] {
        if (!options) {
            return [];
        }

        const result = [];

        for (const option of options) {
            if (typeof option === "string") {
                result.push(SelectOption.createFromString(option));
                continue;
            }
            result.push(SelectOption.create(option));
        }

        return result;
    }
}

export { SelectPresenter, type ISelectPresenter };
