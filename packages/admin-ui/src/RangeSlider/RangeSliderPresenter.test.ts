import { RangeSliderPresenter } from "./RangeSliderPresenter";

describe("RangeSliderPresenter", () => {
    it("should return the correct `defaultValue` when specified in props", () => {
        const presenter = new RangeSliderPresenter({ defaultValue: [10, 90] });
        expect(presenter.sliderVm.defaultValue).toEqual([10, 90]);
    });

    it("should return the correct `value` when specified in props", () => {
        const presenter = new RangeSliderPresenter({ value: [20, 80] });
        expect(presenter.sliderVm.defaultValue).toEqual([20, 80]);
    });

    it("should return the `thumbsVm` with appropriate values", () => {
        {
            // `defaultValue`
            const presenter = new RangeSliderPresenter({ defaultValue: [15, 75] });
            expect(presenter.thumbsVm.values).toEqual(["15", "75"]);
        }

        {
            // `value`
            const presenter = new RangeSliderPresenter({ value: [30, 70] });
            expect(presenter.thumbsVm.values).toEqual(["30", "70"]);
        }

        {
            // `min` and `max`
            const presenter = new RangeSliderPresenter({ min: 0, max: 100 });
            expect(presenter.thumbsVm.values).toEqual(["0", "100"]);
        }

        {
            // `showTooltip`
            const presenter = new RangeSliderPresenter({ showTooltip: true });
            expect(presenter.thumbsVm.showTooltip).toEqual(false);
        }

        {
            // `tooltipSide`
            const presenterTop = new RangeSliderPresenter({ tooltipSide: "top" });
            expect(presenterTop.thumbsVm.tooltipSide).toEqual("top");

            const presenterBottom = new RangeSliderPresenter({ tooltipSide: "bottom" });
            expect(presenterBottom.thumbsVm.tooltipSide).toEqual("bottom");
        }

        {
            // default: no props
            const presenter = new RangeSliderPresenter({});
            expect(presenter.thumbsVm.values).toEqual(["0", "100"]);
            expect(presenter.thumbsVm.showTooltip).toEqual(false);
            expect(presenter.thumbsVm.tooltipSide).toBeUndefined();
        }
    });

    it("should use default `min` and `max` if `value` and `defaultValue` are undefined", () => {
        const presenter = new RangeSliderPresenter({});
        expect(presenter.thumbsVm.values).toEqual(["0", "100"]); // Defaults to [min, max]
    });

    it("should apply `transformValues` function if provided", () => {
        const transformValues = (value: number) => `${value} units`;
        const presenter = new RangeSliderPresenter({ defaultValue: [40, 60], transformValues });

        expect(presenter.thumbsVm.values).toEqual(["40 units", "60 units"]);
    });

    it("should fall back to string representation if `transformValues` is undefined", () => {
        const presenter = new RangeSliderPresenter({ defaultValue: [45, 75] });
        expect(presenter.thumbsVm.values).toEqual(["45", "75"]);
    });

    it("should update `localValues` and `thumbsVm.values` on `onValueChange` call", () => {
        const presenter = new RangeSliderPresenter({ defaultValue: [10, 90] });

        presenter.sliderVm.onValueChange([20, 80]);
        expect(presenter.thumbsVm.values).toEqual(["20", "80"]);
    });

    it("should correctly handle edge cases with negative values", () => {
        const presenter = new RangeSliderPresenter({ defaultValue: [-10, 10] });
        expect(presenter.thumbsVm.values).toEqual(["-10", "10"]);
    });

    it("should toggle `showTooltip` based on `onValueChange` and `onValueCommit`", () => {
        const presenter = new RangeSliderPresenter({ showTooltip: true });

        presenter.sliderVm.onValueChange([30, 70]);
        expect(presenter.thumbsVm.showTooltip).toBeTruthy();

        presenter.sliderVm.onValueCommit([30, 70]);
        expect(presenter.thumbsVm.showTooltip).toBeFalsy();
    });
});
