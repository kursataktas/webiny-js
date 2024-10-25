import { makeAutoObservable } from "mobx";
import omit from "lodash/omit";
import { SliderProps as BaseSliderProps } from "@radix-ui/react-slider";
import { SliderProps, SliderThumbProps } from "./Slider";

interface ISliderPresenter {
    get sliderVm(): BaseSliderProps;
    get thumbVm(): SliderThumbProps;
}

class SliderPresenter implements ISliderPresenter {
    private showTooltip: boolean;
    private localValue: number;

    constructor(private props: SliderProps) {
        const { defaultValue, value, min = 0 } = props;
        this.localValue = defaultValue ?? value ?? min;
        this.showTooltip = false;
        makeAutoObservable(this);
    }

    get sliderVm() {
        return {
            ...omit(this.props, ["showTooltip", "tooltipSide", "transformValue"]),
            value: this.value,
            defaultValue: this.defaultValue,
            onValueChange: this.onValueChange,
            onValueCommit: this.onValueCommit
        };
    }

    get thumbVm() {
        return {
            value: this.thumbValue,
            showTooltip: this.showTooltip,
            tooltipSide: this.props.tooltipSide
        };
    }

    private get value(): BaseSliderProps["value"] {
        return this.props.value !== undefined ? [this.props.value] : undefined;
    }

    private get defaultValue(): BaseSliderProps["defaultValue"] {
        return this.props.defaultValue !== undefined ? [this.props.defaultValue] : undefined;
    }

    private onValueChange = (values: number[]) => {
        const [newValue] = values;
        this.localValue = newValue;
        this.showTooltip = !!this.props.showTooltip;
        this.props.onValueChange?.(newValue);
    };

    private onValueCommit = (values: number[]): void => {
        const [newValue] = values;
        this.localValue = newValue;
        this.showTooltip = false;
        this.props.onValueCommit?.(newValue);
    };

    private get thumbValue(): string | undefined {
        if (!this.localValue) {
            return;
        }

        if (!this.props.transformValue) {
            return String(this.localValue);
        }

        return this.props.transformValue(this.localValue);
    }
}

export { SliderPresenter, type ISliderPresenter };
