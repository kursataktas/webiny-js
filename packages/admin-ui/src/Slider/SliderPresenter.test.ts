import { SliderPresenter } from "./SliderPresenter";

describe("SliderPresenter", () => {
    it("should return the compatible `defaultValue` based on props", () => {
        const presenter = new SliderPresenter();
        presenter.init({ defaultValue: 50 });
        expect(presenter.vm.sliderVm.defaultValue).toEqual([50]);
    });

    it("should return the compatible `value` based on props", () => {
        const presenter = new SliderPresenter();
        presenter.init({ value: 50 });
        expect(presenter.vm.sliderVm.value).toEqual([50]);
    });

    it("should return the compatible `thumbVm` based on props", () => {
        {
            // `defaultValue`
            const presenter = new SliderPresenter();
            presenter.init({ defaultValue: 50 });
            expect(presenter.vm.thumbVm.value).toEqual("50");
        }

        {
            // `value`
            const presenter = new SliderPresenter();
            presenter.init({ value: 50 });
            expect(presenter.vm.thumbVm.value).toEqual("50");
        }

        {
            // `min`
            const presenter = new SliderPresenter();
            presenter.init({ min: 50 });
            expect(presenter.vm.thumbVm.value).toEqual("50");
        }

        {
            // `showTooltip`
            const presenter = new SliderPresenter();
            presenter.init({ showTooltip: true });
            expect(presenter.vm.thumbVm.showTooltip).toEqual(false);
        }

        {
            // `tooltipSide`
            const presenterTop = new SliderPresenter();
            presenterTop.init({ tooltipSide: "top" });
            expect(presenterTop.vm.thumbVm.tooltipSide).toEqual("top");

            const presenterBottom = new SliderPresenter();
            presenterBottom.init({ tooltipSide: "bottom" });
            expect(presenterBottom.vm.thumbVm.tooltipSide).toEqual("bottom");
        }

        {
            // default: no props
            const presenter = new SliderPresenter();
            presenter.init({});
            expect(presenter.vm.thumbVm.value).toEqual("0");
            expect(presenter.vm.thumbVm.showTooltip).toEqual(false);
            expect(presenter.vm.thumbVm.tooltipSide).toEqual(undefined);
        }
    });

    it("should use default `min` if `value` and `defaultValue` are both undefined", () => {
        const presenter = new SliderPresenter();
        presenter.init({});
        expect(presenter.vm.thumbVm.value).toEqual("0"); // `min` should default to 0
    });

    it("should apply `transformValue` function if provided", () => {
        const transformValue = (value: number) => `${value}%`;
        const presenter = new SliderPresenter();
        presenter.init({ defaultValue: 30, transformValue });
        expect(presenter.vm.thumbVm.value).toEqual("30%");
    });

    it("should fall back to `localValue` as a string if `transformValue` is undefined", () => {
        const presenter = new SliderPresenter();
        presenter.init({ defaultValue: 45 });
        expect(presenter.vm.thumbVm.value).toEqual("45");
    });

    it("should update `localValue` and `thumbVm.value` when `onValueChange` is called", () => {
        const presenter = new SliderPresenter();
        presenter.init({ defaultValue: 20 });
        presenter.changeValue([40]);
        expect(presenter.vm.thumbVm.value).toEqual("40");
    });

    it("should handle negative values correctly", () => {
        const presenter = new SliderPresenter();
        presenter.init({ defaultValue: -10 });
        expect(presenter.vm.thumbVm.value).toEqual("-10");
    });

    it("should toggle `showTooltip` based on actions", () => {
        const presenter = new SliderPresenter();
        presenter.init({ showTooltip: true });

        presenter.changeValue([30]);
        expect(presenter.vm.thumbVm.showTooltip).toBeTruthy();

        presenter.commitValue([30]);
        expect(presenter.vm.thumbVm.showTooltip).toBeFalsy();
    });
});
