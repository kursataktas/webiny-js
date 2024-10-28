import * as React from "react";
import { makeDecoratable } from "@webiny/react-composition";
import { Label } from "~/Label";
import { ComposableRangeSlider, RangeSliderProps as BaseRangeSliderProps } from "~/RangeSlider";
import { useRangeSlider } from "~/Form/RangeSlider/useRangeSlider";

/**
 * Range Slider Value
 */
interface RangeSliderValueProps extends React.HTMLAttributes<HTMLSpanElement> {
    value: string;
}

const RangeSliderBaseValue = (props: RangeSliderValueProps) => (
    <span className={"font-normal text-sm leading-none"}>{props.value}</span>
);

const RangeSliderValue = makeDecoratable("RangeSliderValue", RangeSliderBaseValue);

interface RangeSliderProps extends BaseRangeSliderProps {
    label: React.ReactNode;
    valueConverter?: (value: number) => string;
}

const DecoratableFormRangeSlider = (props: RangeSliderProps) => {
    const { sliderVm, thumbsVm, labelsVm } = useRangeSlider(props);

    return (
        <div className={"w-full"}>
            <div>
                <Label text={props.label} weight={"light"} />
            </div>
            <div className={"flex flex-row items-center justify-between"}>
                <div className={"basis-1/12 pr-2"}>
                    <RangeSliderValue value={labelsVm.values[0]} />
                </div>
                <div className={"basis-10/12"}>
                    <ComposableRangeSlider sliderVm={sliderVm} thumbsVm={thumbsVm} />
                </div>
                <div className={"basis-1/12 pl-2 text-right"}>
                    <RangeSliderValue value={labelsVm.values[1]} />
                </div>
            </div>
        </div>
    );
};

const RangeSlider = makeDecoratable("RangeSlider", DecoratableFormRangeSlider);

export { RangeSlider, type RangeSliderProps };
