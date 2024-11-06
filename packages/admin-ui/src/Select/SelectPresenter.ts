import { makeAutoObservable } from "mobx";
import omit from "lodash/omit";
import { SelectOptionsVm, SelectProps, SelectTriggerVm, SelectVm } from "./Select";
import { SelectOption } from "./SelectOption";
import { SelectOptionMapper } from "~/Select/SelectOptionMapper";

interface ISelectPresenter<TProps extends SelectProps = SelectProps> {
    vm: {
        selectVm: SelectVm;
        selectTriggerVm: SelectTriggerVm;
        selectOptionsVm: SelectOptionsVm;
    };
    init: (props: TProps) => void;
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
                placeholder: this.props?.placeholder || "Select an option",
                size: this.props?.size,
                variant: this.props?.variant
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

        return options.map(option => {
            if (typeof option === "string") {
                return SelectOption.createFromString(option);
            }
            return SelectOption.create(option);
        });
    }
}

export { SelectPresenter, type ISelectPresenter };
