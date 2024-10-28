import { useEffect, useMemo, useState } from "react";
import { autorun } from "mobx";
import { SliderProps } from "./Slider";
import { SliderPresenter } from "./SliderPresenter";

export const useSlider = (props: SliderProps) => {
    const presenter = useMemo(() => new SliderPresenter(props), [props]);
    const [sliderVm, setSliderVm] = useState(presenter.sliderVm);
    const [thumbVm, setThumbVm] = useState(presenter.thumbVm);

    useEffect(() => {
        const dispose = autorun(() => {
            setSliderVm(presenter.sliderVm);
            setThumbVm(presenter.thumbVm);
        });
        return () => dispose(); // Cleanup on unmount
    }, [presenter]);

    return { sliderVm, thumbVm };
};
