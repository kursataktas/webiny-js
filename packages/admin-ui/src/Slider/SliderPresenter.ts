import { makeAutoObservable } from "mobx";
import omit from "lodash/omit";
import { SliderProps as BaseSliderProps } from "@radix-ui/react-slider";
import { SliderProps, SliderThumbProps } from "./Slider";

export interface ISliderVm extends BaseSliderProps {
    min: number;
}

interface ISliderPresenter<TProps> {
    get vm(): {
        sliderVm: ISliderVm;
        thumbVm: SliderThumbProps;
    };
    init: (props: TProps) => void;
    changeValue: (values: number[]) => void;
    commitValue: (values: number[]) => void;
}

class SliderPresenter implements ISliderPresenter<SliderProps> {
    private props: SliderProps | undefined;
    private showTooltip: boolean;

    constructor() {
        this.props = undefined;
        this.showTooltip = false;
        makeAutoObservable(this);
    }

    init(props: SliderProps) {
        this.props = props;
    }

    get vm() {
        return {
            sliderVm: {
                ...omit(this.props, [
                    "showTooltip",
                    "tooltipSide",
                    "transformValue",
                    "onValueChange",
                    "onValueCommit"
                ]),
                value: this.value,
                min: this.min
            },
            thumbVm: {
                value: this.transformToLabelValue(this.value?.[0]),
                showTooltip: this.showTooltip,
                tooltipSide: this.props?.tooltipSide
            }
        };
    }

    public changeValue = (values: number[]) => {
        const [newValue] = values;
        this.showTooltip = !!this.props?.showTooltip;
        this.props?.onValueChange(newValue);
    };

    public commitValue = (values: number[]) => {
        const [newValue] = values;
        this.showTooltip = false;
        this.props?.onValueCommit?.(newValue);
    };

    private get value() {
        return this.props?.value !== undefined ? [this.props.value] : undefined;
    }

    private get min() {
        return this.props?.min ?? 0;
    }

    private transformToLabelValue(value?: number) {
        if (typeof value === "undefined") {
            return;
        }
        return this.props?.transformValue ? this.props.transformValue(value) : String(value);
    }
}

export { SliderPresenter, type ISliderPresenter };
