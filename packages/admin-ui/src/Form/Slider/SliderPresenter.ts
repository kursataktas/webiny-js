import { makeAutoObservable } from "mobx";
import { ISliderPresenter } from "~/Slider";
import { SliderProps } from "~/Form";

class FormSliderPresenter implements ISliderPresenter {
    private sliderPresenter: ISliderPresenter;
    private localValue: number;

    constructor(private props: SliderProps, sliderPresenter: ISliderPresenter) {
        const { defaultValue, value, min = 0 } = props;
        this.localValue = defaultValue ?? value ?? min;
        this.sliderPresenter = sliderPresenter;
        makeAutoObservable(this);
    }

    get sliderVm() {
        return {
            ...this.sliderPresenter.sliderVm,
            onValueChange: this.onValueChange
        };
    }

    get thumbVm() {
        return this.sliderPresenter.thumbVm;
    }

    get labelVm() {
        return { label: this.props.label, value: this.labelValue };
    }

    private onValueChange = (values: number[]): void => {
        const [newValue] = values;
        this.localValue = newValue;
        this.sliderPresenter.sliderVm.onValueChange?.(values);
    };

    private get labelValue() {
        return this.props.transformValue
            ? this.props.transformValue(this.localValue)
            : String(this.localValue);
    }
}

export { FormSliderPresenter };
