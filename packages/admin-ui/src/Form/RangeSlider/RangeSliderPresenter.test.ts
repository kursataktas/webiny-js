import { FormRangeSliderPresenter } from "./RangeSliderPresenter";
import { RangeSliderPresenter } from "~/RangeSlider";

describe("FormRangeSliderPresenter", () => {
    it("should return the compatible `labelVm` based on props", () => {
        {
            // `defaultValue`
            const presenter = new RangeSliderPresenter({ defaultValue: [25, 75] });
            const formSliderPresenter = new FormRangeSliderPresenter(
                { label: "Label", defaultValue: [25, 75] },
                presenter
            );
            expect(formSliderPresenter.labelsVm.values).toEqual(["25", "75"]);
        }

        {
            // `value`
            const presenter = new RangeSliderPresenter({ value: [25, 75] });
            const formSliderPresenter = new FormRangeSliderPresenter(
                { label: "Label", value: [25, 75] },
                presenter
            );
            expect(formSliderPresenter.labelsVm.values).toEqual(["25", "75"]);
        }

        {
            // `min` & `max`
            const presenter = new RangeSliderPresenter({ min: 25, max: 75 });
            const formSliderPresenter = new FormRangeSliderPresenter(
                { label: "Label", value: [25, 75] },
                presenter
            );
            expect(formSliderPresenter.labelsVm.values).toEqual(["25", "75"]);
        }

        {
            // default
            const presenter = new RangeSliderPresenter({});
            const formSliderPresenter = new FormRangeSliderPresenter({ label: "Label" }, presenter);
            expect(formSliderPresenter.labelsVm.values).toEqual(["0", "100"]);
        }
    });

    it("should use default value if `value` and `defaultValue` are both undefined", () => {
        const presenter = new RangeSliderPresenter({});
        const formSliderPresenter = new FormRangeSliderPresenter({ label: "Label" }, presenter);

        expect(formSliderPresenter.labelsVm.values).toEqual(["0", "100"]); // `min` should default to 0 and `max` should be 100
    });

    it("should apply the `transformValue` function if provided", () => {
        const transformValues = (value: number) => `${value}%`;
        const presenter = new RangeSliderPresenter({});
        const formSliderPresenter = new FormRangeSliderPresenter(
            { label: "Label", defaultValue: [30, 60], transformValues },
            presenter
        );

        expect(formSliderPresenter.labelsVm.values).toEqual(["30%", "60%"]);
    });

    it("should fall back to `localValue` as a string if `transformValue` is undefined", () => {
        const presenter = new RangeSliderPresenter({});
        const formSliderPresenter = new FormRangeSliderPresenter(
            { label: "Label", defaultValue: [45, 55] },
            presenter
        );

        expect(formSliderPresenter.labelsVm.values).toEqual(["45", "55"]);
    });

    it("should update `localValue` and `labelVm.value` when `onValueChange` is called", () => {
        const presenter = new RangeSliderPresenter({});
        const formSliderPresenter = new FormRangeSliderPresenter(
            { label: "Label", defaultValue: [20, 80] },
            presenter
        );

        formSliderPresenter.sliderVm.onValueChange([40, 60]);
        expect(formSliderPresenter.labelsVm.values).toEqual(["40", "60"]);
    });

    it("should handle negative values correctly", () => {
        const presenter = new RangeSliderPresenter({});
        const formSliderPresenter = new FormRangeSliderPresenter(
            { label: "Label", defaultValue: [-10, 10] },
            presenter
        );

        expect(formSliderPresenter.labelsVm.values).toEqual(["-10", "10"]);
    });
});
