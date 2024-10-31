import { makeAutoObservable } from "mobx";
import {
    IRangeSliderPresenter,
    RangeSliderThumbsVm,
    RangeSliderVm,
    RangeSliderProps as BaseRangeSliderProps
} from "~/RangeSlider";
import { RangeSliderLabelVm, RangeSliderProps } from "./RangeSlider";

interface IFormRangeSliderPresenter<TProps> {
    get vm(): {
        sliderVm: RangeSliderVm;
        thumbsVm: RangeSliderThumbsVm;
        labelVm: RangeSliderLabelVm;
    };
    init: (props: TProps) => void;
    changeValues: (values: number[]) => void;
    commitValues: (values: number[]) => void;
}

class FormRangeSliderPresenter implements IFormRangeSliderPresenter<RangeSliderProps> {
    private rangeSliderPresenter: IRangeSliderPresenter<BaseRangeSliderProps>;
    private props: RangeSliderProps | undefined;

    constructor(rangeSliderPresenter: IRangeSliderPresenter<BaseRangeSliderProps>) {
        this.rangeSliderPresenter = rangeSliderPresenter;
        makeAutoObservable(this);
    }

    init(props: RangeSliderProps) {
        this.props = props;
        this.rangeSliderPresenter.init(props);
    }

    get vm() {
        return {
            sliderVm: {
                ...this.rangeSliderPresenter.vm.sliderVm
            },
            thumbsVm: {
                ...this.rangeSliderPresenter.vm.thumbsVm
            },
            labelVm: {
                label: this.props?.label ?? "",
                values: this.transformToLabelValues(this.rangeSliderPresenter.vm.sliderVm.values)
            }
        };
    }

    public changeValues = (values: number[]): void => {
        this.rangeSliderPresenter.changeValues(values);
    };

    public commitValues = (values: number[]): void => {
        this.rangeSliderPresenter.commitValues(values);
    };

    private transformToLabelValues(values: number[]) {
        return values.map(value =>
            this.props?.transformValues ? this.props.transformValues(value) : String(value)
        );
    }
}

export { FormRangeSliderPresenter };
