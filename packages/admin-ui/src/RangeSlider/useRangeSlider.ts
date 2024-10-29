import { useEffect, useMemo, useState } from "react";
import { autorun } from "mobx";
import { RangeSliderProps } from "./RangeSlider";
import { RangeSliderPresenter } from "./RangeSliderPresenter";

export const useRangeSlider = (props: RangeSliderProps) => {
    const presenter = useMemo(() => new RangeSliderPresenter(props), [JSON.stringify(props)]);
    const [sliderVm, setSliderVm] = useState(presenter.sliderVm);
    const [thumbsVm, setThumbsVm] = useState(presenter.thumbsVm);

    useEffect(() => {
        const dispose = autorun(() => {
            setSliderVm(presenter.sliderVm);
            setThumbsVm(presenter.thumbsVm);
        });
        return () => dispose(); // Cleanup on unmount
    }, [presenter]);

    return { sliderVm, thumbsVm };
};
