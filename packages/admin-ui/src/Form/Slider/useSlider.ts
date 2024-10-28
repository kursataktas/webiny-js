import { useEffect, useMemo, useState } from "react";
import omit from "lodash/omit";
import { autorun } from "mobx";
import { SliderProps } from "./Slider";
import { SliderPresenter } from "~/Slider";
import { FormSliderPresenter } from "./SliderPresenter";

export const useSlider = (props: SliderProps) => {
    const presenter = useMemo(() => {
        const sliderPresenter = new SliderPresenter(omit(props, ["label", "labelPosition"]));
        return new FormSliderPresenter(props, sliderPresenter);
    }, [props.value]);
    const [sliderVm, setSliderVm] = useState(presenter.sliderVm);
    const [thumbVm, setThumbVm] = useState(presenter.thumbVm);
    const [labelVm, setLabelVm] = useState(presenter.labelVm);

    useEffect(() => {
        const dispose = autorun(() => {
            setSliderVm(presenter.sliderVm);
            setThumbVm(presenter.thumbVm);
            setLabelVm(presenter.labelVm);
        });
        return () => dispose(); // Cleanup on unmount
    }, [presenter]);

    return { sliderVm, thumbVm, labelVm };
};
