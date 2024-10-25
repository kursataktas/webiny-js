import { makeAutoObservable } from "mobx";
import omit from "lodash/omit";
import { SliderProps as BaseSliderProps } from "@radix-ui/react-slider";
import { RangeSliderProps } from "./RangeSlider";
import { SliderThumbProps } from "~/Slider";

interface IRangeSliderPresenter {
    get sliderVm(): BaseSliderProps;
    get thumbsVm(): Omit<SliderThumbProps, "value"> & {
        values: string[] | undefined;
    };
}

class RangeSliderPresenter implements IRangeSliderPresenter {
    private showTooltip: boolean;
    private localValues: number[];

    constructor(private props: RangeSliderProps) {
        const { defaultValue, value, min = 0, max = 100 } = props;
        this.showTooltip = false;
        this.localValues = defaultValue ?? value ?? [min, max];
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
