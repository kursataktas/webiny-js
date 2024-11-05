import { makeAutoObservable } from "mobx";
import omit from "lodash/omit";
import { ISelectPresenter } from "~/Select";
import { SelectLabelVm, SelectProps } from "./Select";

interface IFormSelectPresenter<TProps extends SelectProps = SelectProps>
    extends ISelectPresenter<TProps> {
    get vm(): ISelectPresenter<TProps>["vm"] & { selectLabelVm: SelectLabelVm };
}

class FormSelectPresenter implements IFormSelectPresenter {
    private selectPresenter: ISelectPresenter;
    private props?: SelectProps;

    constructor(selectPresenter: ISelectPresenter) {
        this.selectPresenter = selectPresenter;
        this.props = undefined;
        makeAutoObservable(this);
    }

    init(props: SelectProps) {
        this.props = props;
        this.selectPresenter.init(omit(this.props, ["label"]));
    }

    get vm() {
        return {
            selectVm: {
                ...this.selectPresenter.vm.selectVm
            },
            selectTriggerVm: {
                ...this.selectPresenter.vm.selectTriggerVm
            },
            selectOptionsVm: {
                ...this.selectPresenter.vm.selectOptionsVm
            },
            selectLabelVm: {
                label: this.props?.label ?? ""
            }
        };
    }

    public changeValue = (value: string) => {
        this.selectPresenter.changeValue(value);
    };
}

export { FormSelectPresenter, type IFormSelectPresenter };
