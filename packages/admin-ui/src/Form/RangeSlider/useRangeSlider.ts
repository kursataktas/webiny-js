import { useEffect, useMemo, useState } from "react";
import { autorun } from "mobx";
import { RangeSliderProps } from "./RangeSlider";
import { RangeSliderPresenter } from "~/RangeSlider";
import { FormRangeSliderPresenter } from "./RangeSliderPresenter";

export const useRangeSlider = (props: RangeSliderProps) => {
    const presenter = useMemo(() => {
        const rangeSliderPresenter = new RangeSliderPresenter(props);
        return new FormRangeSliderPresenter(props, rangeSliderPresenter);
    }, [props.value]);
    const [sliderVm, setSliderVm] = useState(presenter.sliderVm);
    const [thumbsVm, setThumbsVm] = useState(presenter.thumbsVm);
    const [labelsVm, setLabelsVm] = useState(presenter.labelsVm);

    useEffect(() => {
        const dispose = autorun(() => {
            setSliderVm(presenter.sliderVm);
            setThumbsVm(presenter.thumbsVm);
            setLabelsVm(presenter.labelsVm);
        });
        return () => dispose(); // Cleanup on unmount
    }, [presenter]);

    return { sliderVm, thumbsVm, labelsVm };
};
