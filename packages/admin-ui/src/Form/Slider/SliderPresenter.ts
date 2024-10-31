import { makeAutoObservable } from "mobx";
import { ISliderPresenter, SliderProps as BaseSliderProps } from "~/Slider";
import { SliderProps } from "~/Form";
import omit from "lodash/omit";

class FormSliderPresenter implements ISliderPresenter<SliderProps> {
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
