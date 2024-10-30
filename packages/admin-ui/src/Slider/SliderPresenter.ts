import { makeAutoObservable } from "mobx";
import omit from "lodash/omit";
import { SliderProps as BaseSliderProps } from "@radix-ui/react-slider";
import { SliderProps, SliderThumbProps } from "./Slider";

interface ISliderPresenter<TProps> {
    get vm(): {
        sliderVm: BaseSliderProps;
        thumbVm: SliderThumbProps;
    };
    init: (props: TProps) => void;
    changeValue: (values: number[]) => void;
    commitValue: (values: number[]) => void;
}

class SliderPresenter implements ISliderPresenter<SliderProps> {
    private props: SliderProps | undefined;
    private localValue: number;
    private showTooltip: boolean;

    constructor() {
        this.props = undefined;
        this.localValue = 0;
        this.showTooltip = false;
        makeAutoObservable(this);
    }

    init(props: SliderProps) {
        const { defaultValue, value, min } = props;
        this.props = props;
        this.localValue = defaultValue ?? value ?? min ?? this.localValue;
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
                defaultValue: this.defaultValue
            },
            thumbVm: {
                value: this.transformToLabelValue(this.localValue),
                showTooltip: this.showTooltip,
                tooltipSide: this.props?.tooltipSide
            }
        };
    }

    public changeValue = (values: number[]) => {
        const [newValue] = values;
        this.localValue = newValue;
        this.showTooltip = !!this.props?.showTooltip;
        this.props?.onValueChange?.(newValue);
    };

    public commitValue = (values: number[]): void => {
        const [newValue] = values;
        this.localValue = newValue;
        this.showTooltip = false;
        this.props?.onValueCommit?.(newValue);
    };

    private get value(): BaseSliderProps["value"] {
        return this.props?.value !== undefined ? [this.props.value] : undefined;
    }

    private get defaultValue(): BaseSliderProps["defaultValue"] {
        return this.props?.defaultValue !== undefined ? [this.props.defaultValue] : undefined;
    }

    private transformToLabelValue(value: number): string {
        return this.props?.transformValue ? this.props.transformValue(value) : String(value);
    }
}

export { SliderPresenter, type ISliderPresenter };
