import * as React from "react";
import { makeDecoratable } from "@webiny/react-composition";
import { Label } from "~/Label";
import { SliderRenderer, SliderProps as BaseSliderProps, SliderVm, SliderThumbVm } from "~/Slider";
import { useSlider } from "./useSlider";

type LabelPosition = "top" | "side";

type LabelVm = {
    label: React.ReactNode;
    position: LabelPosition;
    value: string;
};

/**
 * Slider Value
 */
interface SliderValueProps extends React.HTMLAttributes<HTMLSpanElement> {
    value?: LabelVm["value"];
}

const DecoratorableSliderValue = (props: SliderValueProps) => {
    if (!props.value) {
        return null;
    }
    return <span className={"font-normal text-sm leading-none"}>{props.value}</span>;
};

const SliderValue = makeDecoratable("SliderValue", DecoratorableSliderValue);

interface SliderProps extends BaseSliderProps {
    label: LabelVm["label"];
    labelPosition?: LabelPosition;
}

interface DecoratorableSliderProps {
    sliderVm: SliderVm;
    thumbVm: SliderThumbVm;
    labelVm: LabelVm;
    onValueChange: (values: number[]) => void;
    onValueCommit: (values: number[]) => void;
}

/**
 * Slider with top label
 */
const DecoratorableSliderWithTopValue = ({
    sliderVm,
    thumbVm,
    labelVm,
    onValueChange,
    onValueCommit
}: DecoratorableSliderProps) => {
    return (
        <div className={"w-full"}>
            <div className={"flex pr-1 py-1 mb-2"}>
                <Label weight={"light"} text={labelVm.label} value={labelVm.value} />
            </div>
            <div>
                <SliderRenderer
                    sliderVm={sliderVm}
                    thumbVm={thumbVm}
                    onValueChange={onValueChange}
                    onValueCommit={onValueCommit}
                />
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
    labelVm,
    onValueChange,
    onValueCommit
}: DecoratorableSliderProps) => {
    return (
        <div className={"w-full flex flex-row items-center justify-between"}>
            <div className={"basis-2/12 pr-2"}>
                <Label text={labelVm.label} weight={"light"} />
            </div>
            <div className={"basis-9/12"}>
                <SliderRenderer
                    sliderVm={sliderVm}
                    thumbVm={thumbVm}
                    onValueChange={onValueChange}
                    onValueCommit={onValueCommit}
                />
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
const DecoratableFormSlider = (props: SliderProps) => {
    const { vm, changeValue, commitValue } = useSlider(props);

    if (vm.labelVm.position === "side") {
        return (
            <SliderWithSideValue
                sliderVm={vm.sliderVm}
                thumbVm={vm.thumbVm}
                labelVm={vm.labelVm}
                onValueChange={changeValue}
                onValueCommit={commitValue}
            />
        );
    }

    return (
        <SliderWithTopValue
            sliderVm={vm.sliderVm}
            thumbVm={vm.thumbVm}
            labelVm={vm.labelVm}
            onValueChange={changeValue}
            onValueCommit={commitValue}
        />
    );
};

const Slider = makeDecoratable("Slider", DecoratableFormSlider);

export { Slider, type SliderProps, type LabelVm };
