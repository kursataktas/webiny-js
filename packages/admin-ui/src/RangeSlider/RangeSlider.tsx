import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { makeDecoratable } from "@webiny/react-composition";
import { SliderRoot, SliderThumb, SliderThumbProps, SliderTrack } from "~/Slider";
import { useRangeSlider } from "./useRangeSlider";

/**
 * ComposableRangeSlider
 */
type SliderThumbsProps = Omit<SliderThumbProps, "value"> & {
    values: string[];
};

interface ComposableRangeSliderProps {
    sliderVm: SliderPrimitive.SliderProps;
    thumbsVm: SliderThumbsProps;
}

const DecoratorableComposableRangeSlider = ({ sliderVm, thumbsVm }: ComposableRangeSliderProps) => {
    return (
        <SliderRoot {...sliderVm}>
            <SliderTrack />
            <SliderThumb {...thumbsVm} value={thumbsVm.values[0]} />
            <SliderThumb {...thumbsVm} value={thumbsVm.values[1]} />
        </SliderRoot>
    );
};

const ComposableRangeSlider = makeDecoratable(
    "ComposableRangeSlider",
    DecoratorableComposableRangeSlider
);

/**
 * RangeSlider
 */
type RangeSliderProps = SliderPrimitive.SliderProps & {
    transformValues?: (value: number) => string;
    showTooltip?: boolean;
    tooltipSide?: "top" | "bottom";
};

const DecoratableRangeSlider = (props: RangeSliderProps) => {
    const { sliderVm, thumbsVm } = useRangeSlider(props);

    return <ComposableRangeSlider sliderVm={sliderVm} thumbsVm={thumbsVm} />;
};

const RangeSlider = makeDecoratable("RangeSlider", DecoratableRangeSlider);

export { RangeSlider, ComposableRangeSlider, type RangeSliderProps, type SliderThumbsProps };
