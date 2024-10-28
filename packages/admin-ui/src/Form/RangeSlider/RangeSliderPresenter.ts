import { makeAutoObservable } from "mobx";
import { IRangeSliderPresenter } from "~/RangeSlider";
import { RangeSliderProps } from "~/Form";

class FormRangeSliderPresenter implements IRangeSliderPresenter {
    private rangeSliderPresenter: IRangeSliderPresenter;
    private localValues: number[];

    constructor(private props: RangeSliderProps, rangeSliderPresenter: IRangeSliderPresenter) {
        const { defaultValue, value, min = 0, max = 100 } = props;
        this.rangeSliderPresenter = rangeSliderPresenter;
        this.localValues = defaultValue ?? value ?? [min, max];
        makeAutoObservable(this);
    }

    get sliderVm() {
        return {
            ...this.rangeSliderPresenter.sliderVm,
            onValueChange: this.onValueChange
        };
    }

    get thumbsVm() {
        return {
            ...this.rangeSliderPresenter.thumbsVm
        };
    }

    get labelsVm() {
        return {
            values: this.labelValues
        };
    }

    private onValueChange = (values: number[]): void => {
        this.localValues = values;
        this.rangeSliderPresenter.sliderVm.onValueChange?.(values);
    };

    private get labelValues() {
        return this.localValues.map(value =>
            this.props.transformValues ? this.props.transformValues(value) : String(value)
        );
    }
}

export { FormRangeSliderPresenter };
