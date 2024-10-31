import { makeAutoObservable } from "mobx";
import { ISliderPresenter, SliderProps as BaseSliderProps } from "~/Slider";
import { SliderProps } from "~/Form";
import omit from "lodash/omit";

class FormSliderPresenter implements ISliderPresenter<SliderProps> {
    private sliderPresenter: ISliderPresenter<BaseSliderProps>;
    private props: SliderProps | undefined;
    private localValue: number;

    constructor(sliderPresenter: ISliderPresenter<BaseSliderProps>) {
        this.sliderPresenter = sliderPresenter;
        this.props = undefined;
        this.localValue = 0;
        makeAutoObservable(this);
    }

    init(props: SliderProps) {
        this.sliderPresenter.init(omit(props, ["label", "labelPosition"]));
        const { defaultValue, value, min } = props;
        this.props = props;

        console.log("FormSliderPresenter props", props);
        this.localValue = defaultValue ?? value ?? min ?? this.localValue;
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
                value: this.transformToLabelValue(this.localValue)
            }
        };
    }

    public changeValue = (values: number[]): void => {
        const [newValue] = values;
        this.localValue = newValue;
        this.sliderPresenter.changeValue(values);
    };

    public commitValue = (values: number[]): void => {
        const [newValue] = values;
        this.localValue = newValue;
        this.sliderPresenter.commitValue(values);
    };

    private transformToLabelValue(value: number): string {
        return this.props?.transformValue ? this.props.transformValue(value) : String(value);
    }
}

export { FormSliderPresenter };
