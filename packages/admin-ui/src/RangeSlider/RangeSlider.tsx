import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { makeDecoratable } from "@webiny/react-composition";
import { observer } from "mobx-react-lite";
import { SliderRoot, SliderThumb, SliderTrack } from "~/Slider";
import { RangeSliderPresenter } from "./RangeSliderPresenter";

type RangeSliderProps = SliderPrimitive.SliderProps & {
    transformValues?: (value: number) => string;
    showTooltip?: boolean;
    tooltipSide?: "top" | "bottom";
};

const RangeSliderBase = observer((props: RangeSliderProps) => {
    const { sliderVm, thumbsVm } = React.useMemo(() => {
        return new RangeSliderPresenter(props);
    }, [props]);

    return (
        <SliderRoot {...sliderVm}>
            <SliderTrack />
            <SliderThumb {...thumbsVm} value={thumbsVm.values ? thumbsVm.values[0] : undefined} />
            <SliderThumb {...thumbsVm} value={thumbsVm.values ? thumbsVm.values[1] : undefined} />
        </SliderRoot>
    );
});

const RangeSlider = makeDecoratable("RangeSlider", RangeSliderBase);

export { RangeSlider, type RangeSliderProps };
