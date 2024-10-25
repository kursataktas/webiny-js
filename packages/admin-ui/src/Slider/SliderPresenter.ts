import { makeAutoObservable } from "mobx";
import omit from "lodash/omit";
import { SliderProps as BaseSliderProps } from "@radix-ui/react-slider";
import { SliderProps, SliderTooltipProps } from "./Slider";

interface ISliderPresenter {
    get sliderVm(): BaseSliderProps;
    get thumbVm(): SliderTooltipProps;
}

class SliderPresenter implements ISliderPresenter {
    private readonly props: SliderProps;
    private showTooltip: boolean;
    private localValue: number;

    constructor(props: SliderProps) {
        this.props = props;
        this.showTooltip = false;
        this.localValue = props.defaultValue ?? props.value ?? props.min ?? 0;
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
        this.localValue = values[0];
        this.showTooltip = !!this.props.showTooltip;

        if (!this.props.onValueChange) {
            return;
        }

        return this.props.onValueChange(values[0]);
    };

    private onValueCommit = (values: number[]): void => {
        this.localValue = values[0];
        this.showTooltip = false;

        if (!this.props.onValueCommit) {
            return;
        }

        return this.props.onValueCommit(values[0]);
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
