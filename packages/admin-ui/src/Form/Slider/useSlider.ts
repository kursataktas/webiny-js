import { useEffect, useMemo, useState } from "react";
import { autorun } from "mobx";
import { SliderProps } from "./Slider";
import { SliderPresenter } from "~/Slider";
import { FormSliderPresenter } from "./SliderPresenter";

export const useSlider = (props: SliderProps) => {
    const presenter = useMemo(() => {
        console.log("creating FormSlider presenter");
        const sliderPresenter = new SliderPresenter();
        const formSliderPresenter = new FormSliderPresenter(sliderPresenter);
        formSliderPresenter.init(props);
        return formSliderPresenter;
    }, [JSON.stringify(props)]);

    const [vm, setVm] = useState(presenter.vm);

    useEffect(() => {
        return autorun(() => {
            setVm(presenter.vm);
        });
    }, [presenter]);

    return { vm, changeValue: presenter.changeValue, commitValue: presenter.commitValue };
};
