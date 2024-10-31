import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { makeDecoratable } from "@webiny/react-composition";
import { SliderRoot, SliderThumb, SliderThumbProps, SliderTrack } from "~/Slider";
import { useRangeSlider } from "./useRangeSlider";

type RangeSliderVm = Omit<
    SliderPrimitive.SliderProps,
    "value" | "min" | "max" | "onValueChange" | "onValueCommit"
> & {
    values: number[];
    min: number;
    max: number;
};

type RangeSliderThumbsVm = Omit<SliderThumbProps, "value"> & {
    values: string[];
};

/**
 * ComposableRangeSlider
 */
interface RangeSliderRendererProps {
    sliderVm: RangeSliderVm;
    thumbsVm: RangeSliderThumbsVm;
    onValuesChange: (values: number[]) => void;
    onValuesCommit: (values: number[]) => void;
}

const DecoratorableRangeSliderRenderer = ({
    sliderVm,
    thumbsVm,
    onValuesChange,
    onValuesCommit
}: RangeSliderRendererProps) => {
    return (
        <SliderRoot
            {...sliderVm}
            value={sliderVm.values}
            onValueChange={onValuesChange}
            onValueCommit={onValuesCommit}
        >
            <SliderTrack />
            <SliderThumb {...thumbsVm} value={thumbsVm.values[0]} />
            <SliderThumb {...thumbsVm} value={thumbsVm.values[1]} />
        </SliderRoot>
    );
};

const RangeSliderRenderer = makeDecoratable(
    "RangeSliderRenderer",
    DecoratorableRangeSliderRenderer
);

/**
 * RangeSlider
 */
interface RangeSliderProps
    extends Omit<
        SliderPrimitive.SliderProps,
        "defaultValue" | "value" | "onValueChange" | "onValueCommit"
    > {
    values?: number[] | undefined;
    onValuesChange?: (values: number[]) => void;
    onValuesCommit?: (values: number[]) => void;
    transformValues?: (value: number) => string;
    showTooltip?: boolean;
    tooltipSide?: "top" | "bottom";
}

const DecoratableRangeSlider = (props: RangeSliderProps) => {
    const { vm, changeValues, commitValues } = useRangeSlider(props);

    return (
        <RangeSliderRenderer
            sliderVm={vm.sliderVm}
            thumbsVm={vm.thumbsVm}
            onValuesChange={changeValues}
            onValuesCommit={commitValues}
        />
    );
};

const RangeSlider = makeDecoratable("RangeSlider", DecoratableRangeSlider);

export {
    RangeSlider,
    RangeSliderRenderer,
    type RangeSliderProps,
    type RangeSliderVm,
    type RangeSliderThumbsVm
};
