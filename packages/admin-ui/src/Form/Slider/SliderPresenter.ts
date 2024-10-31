import { makeAutoObservable } from "mobx";
import omit from "lodash/omit";
import {
    ISliderPresenter,
    SliderProps as BaseSliderProps,
    SliderThumbVm,
    SliderVm
} from "~/Slider";
import { LabelVm, SliderProps } from "./Slider";

interface IFormSliderPresenter<TProps> {
    get vm(): {
        sliderVm: SliderVm;
        thumbVm: SliderThumbVm;
        labelVm: LabelVm;
    };
    init: (props: TProps) => void;
    changeValue: (values: number[]) => void;
    commitValue: (values: number[]) => void;
}

class FormSliderPresenter implements IFormSliderPresenter<SliderProps> {
    private sliderPresenter: ISliderPresenter<BaseSliderProps>;
    private props: SliderProps | undefined;

    constructor(sliderPresenter: ISliderPresenter<BaseSliderProps>) {
        this.sliderPresenter = sliderPresenter;
        makeAutoObservable(this);
    }

    init(props: SliderProps) {
        this.props = props;
        this.sliderPresenter.init(omit(props, ["label", "labelPosition"]));
    }

    get vm() {
        return {
            sliderVm: {
                ...this.sliderPresenter.vm.sliderVm
            },
            thumbVm: {
                ...this.sliderPresenter.vm.thumbVm
            },
            labelVm: {
                label: this.props?.label ?? "",
                position: this.props?.labelPosition ?? "top",
                value: this.transformToLabelValue(
                    this.sliderPresenter.vm.sliderVm.value?.[0] ??
                        this.sliderPresenter.vm.sliderVm.min
                )
            }
        };
    }

    public changeValue = (values: number[]): void => {
        this.sliderPresenter.changeValue(values);
    };

    public commitValue = (values: number[]): void => {
        this.sliderPresenter.commitValue(values);
    };

    private transformToLabelValue(value: number): string {
        return this.props?.transformValue ? this.props.transformValue(value) : String(value);
    }
}

export { FormSliderPresenter };
