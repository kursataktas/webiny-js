import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { makeDecoratable } from "@webiny/react-composition";
import { Label } from "~/Label";
import { ComposableSlider, SliderProps as BaseSliderProps, SliderThumbProps } from "~/Slider";
import { useSlider } from "./useSlider";

/**
 * Slider Value
 */
interface SliderValueProps extends React.HTMLAttributes<HTMLSpanElement> {
    value?: string;
}

const DecoratorableSliderValue = (props: SliderValueProps) => {
    if (!props.value) {
        return null;
    }
    return <span className={"font-normal text-sm leading-none"}>{props.value}</span>;
};

const SliderValue = makeDecoratable("SliderValue", DecoratorableSliderValue);

interface SliderProps extends BaseSliderProps {
    label: React.ReactNode;
    labelPosition?: "top" | "side";
}

interface DecoratorableSliderProps {
    sliderVm: SliderPrimitive.SliderProps;
    thumbVm: SliderThumbProps;
    labelVm: SliderValueProps & { label: React.ReactNode };
}

/**
 * Slider with top label
 */
const DecoratorableSliderWithTopValue = ({
    sliderVm,
    thumbVm,
    labelVm
}: DecoratorableSliderProps) => {
    return (
        <div className={"w-full"}>
            <div className={"flex pr-1 py-1 mb-2"}>
                <Label weight={"light"} text={labelVm.label} value={labelVm.value} />
            </div>
            <div>
                <ComposableSlider sliderVm={sliderVm} thumbVm={thumbVm} />
            </div>
        </div>
    );
};
const SliderWithTopValue = makeDecoratable("SliderWithTopValue", DecoratorableSliderWithTopValue);

/**
 * Slider with side label
 */
const DecoratorableSliderWithSideValue = ({
    sliderVm,
    thumbVm,
    labelVm
}: DecoratorableSliderProps) => {
    return (
        <div className={"w-full flex flex-row items-center justify-between"}>
            <div className={"basis-2/12 pr-2"}>
                <Label text={labelVm.label} weight={"light"} />
            </div>
            <div className={"basis-9/12"}>
                <ComposableSlider sliderVm={sliderVm} thumbVm={thumbVm} />
            </div>
            {labelVm.value && (
                <div className={"basis-1/12 pl-2 text-right"}>
                    <SliderValue value={labelVm.value} />
                </div>
            )}
        </div>
    );
};
const SliderWithSideValue = makeDecoratable(
    "SliderWithSideValue",
    DecoratorableSliderWithSideValue
);

/**
 * Slider
 */
const DecoratableFormSlider = ({ labelPosition, ...props }: SliderProps) => {
    const { sliderVm, thumbVm, labelVm } = useSlider(props);

    if (labelPosition === "side") {
        return <SliderWithSideValue sliderVm={sliderVm} thumbVm={thumbVm} labelVm={labelVm} />;
    }

    return <SliderWithTopValue sliderVm={sliderVm} thumbVm={thumbVm} labelVm={labelVm} />;
};

const Slider = makeDecoratable("Slider", DecoratableFormSlider);

export { Slider, type SliderProps };
