import { makeAutoObservable } from "mobx";
import omit from "lodash/omit";
import { SliderProps as BaseSliderProps } from "@radix-ui/react-slider";
import { SliderTooltipProps } from "~/Slider";
import { RangeSliderProps } from "./RangeSlider";

interface IRangeSliderPresenter {
    get sliderVm(): BaseSliderProps;
    get thumbsVm(): Omit<SliderTooltipProps, "value"> & {
        values: string[] | undefined;
    };
}

class RangeSliderPresenter implements IRangeSliderPresenter {
    private readonly props: RangeSliderProps;
    private showTooltip: boolean;
    private localValues: number[];

    constructor(props: RangeSliderProps) {
        this.props = props;
        this.showTooltip = false;
        this.localValues = props.defaultValue ?? props.value ?? [props.min ?? 0, props.max ?? 100];
        makeAutoObservable(this);
    }

    get sliderVm() {
        return {
            ...omit(this.props, ["showTooltip", "tooltipSide", "transformValues"]),
            defaultValue: this.localValues,
            onValueChange: this.onValueChange,
            onValueCommit: this.onValueCommit
        };
    }

    get thumbsVm() {
        return {
            values: this.thumbValues,
            showTooltip: this.showTooltip,
            tooltipSide: this.props.tooltipSide
        };
    }

    private onValueChange = (values: number[]) => {
        this.localValues = values;
        this.showTooltip = !!this.props.showTooltip;
        this.props.onValueChange?.(values);
    };

    private onValueCommit = (values: number[]): void => {
        this.localValues = values;
        this.showTooltip = false;
        this.props.onValueCommit?.(values);
    };

    private get thumbValues(): string[] | undefined {
        return this.localValues.map(value =>
            this.props.transformValues ? this.props.transformValues(value) : String(value)
        );
    }
}

export { RangeSliderPresenter, type IRangeSliderPresenter };
