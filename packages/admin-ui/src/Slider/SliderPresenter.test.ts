import { SliderPresenter } from "./SliderPresenter";

describe("SliderPresenter", () => {
    it("should return the compatible `defaultValue` based on props", () => {
        const presenter = new SliderPresenter({ defaultValue: 50 });
        expect(presenter.sliderVm.defaultValue).toEqual([50]);
    });

    it("should return the compatible `value` based on props", () => {
        const presenter = new SliderPresenter({ value: 50 });
        expect(presenter.sliderVm.value).toEqual([50]);
    });

    it("should return the compatible `thumbVm` based on props", () => {
        {
            // `defaultValue`
            const presenter = new SliderPresenter({ defaultValue: 50 });
            expect(presenter.thumbVm.value).toEqual("50");
        }

        {
            // `value`
            const presenter = new SliderPresenter({ value: 50 });
            expect(presenter.thumbVm.value).toEqual("50");
        }

        {
            // `min`
            const presenter = new SliderPresenter({ min: 50 });
            expect(presenter.thumbVm.value).toEqual("50");
        }

        {
            // `showTooltip`
            const presenter = new SliderPresenter({ showTooltip: true });
            expect(presenter.thumbVm.showTooltip).toEqual(false);
        }

        {
            // `tooltipSide`
            const presenterTop = new SliderPresenter({ tooltipSide: "top" });
            expect(presenterTop.thumbVm.tooltipSide).toEqual("top");

            const presenterBottom = new SliderPresenter({ tooltipSide: "bottom" });
            expect(presenterBottom.thumbVm.tooltipSide).toEqual("bottom");
        }

        {
            // default: no props
            const presenter = new SliderPresenter({});
            expect(presenter.thumbVm.value).toEqual("0");
            expect(presenter.thumbVm.showTooltip).toEqual(false);
            expect(presenter.thumbVm.tooltipSide).toEqual(undefined);
        }
    });

    it("should use default `min` if `value` and `defaultValue` are both undefined", () => {
        const presenter = new SliderPresenter({});
        expect(presenter.thumbVm.value).toEqual("0"); // `min` should default to 0
    });

    it("should apply `transformValue` function if provided", () => {
        const transformValue = (value: number) => `${value}%`;
        const presenter = new SliderPresenter({ defaultValue: 30, transformValue });

        expect(presenter.thumbVm.value).toEqual("30%");
    });

    it("should fall back to `localValue` as a string if `transformValue` is undefined", () => {
        const presenter = new SliderPresenter({ defaultValue: 45 });
        expect(presenter.thumbVm.value).toEqual("45");
    });

    it("should update `localValue` and `thumbVm.value` when `onValueChange` is called", () => {
        const presenter = new SliderPresenter({ defaultValue: 20 });

        presenter.sliderVm.onValueChange([40]);
        expect(presenter.thumbVm.value).toEqual("40");
    });

    it("should handle negative values correctly", () => {
        const presenter = new SliderPresenter({ defaultValue: -10 });
        expect(presenter.thumbVm.value).toEqual("-10");
    });

    it("should toggle `showTooltip` based on actions", () => {
        const presenter = new SliderPresenter({ showTooltip: true });

        presenter.sliderVm.onValueChange([30]);
        expect(presenter.thumbVm.showTooltip).toBeTruthy();

        presenter.sliderVm.onValueCommit([30]);
        expect(presenter.thumbVm.showTooltip).toBeFalsy();
    });
});
