import { FormSliderPresenter } from "./SliderPresenter";
import { SliderPresenter } from "~/Slider";

describe("FormSliderPresenter", () => {
    it("should return the compatible `labelVm` based on props", () => {
        {
            // `defaultValue`
            const presenter = new SliderPresenter();
            const formSliderPresenter = new FormSliderPresenter(presenter);
            formSliderPresenter.init({ label: "Label", defaultValue: 10 });
            expect(formSliderPresenter.vm.labelVm.label).toEqual("Label");
            expect(formSliderPresenter.vm.labelVm.value).toEqual("10");
        }

        {
            // `value`
            const presenter = new SliderPresenter();
            const formSliderPresenter = new FormSliderPresenter(presenter);
            formSliderPresenter.init({ label: "Label", value: 20 });
            expect(formSliderPresenter.vm.labelVm.label).toEqual("Label");
            expect(formSliderPresenter.vm.labelVm.value).toEqual("20");
        }

        {
            // `min`
            const presenter = new SliderPresenter();
            const formSliderPresenter = new FormSliderPresenter(presenter);
            formSliderPresenter.init({ label: "Label", min: 30 });
            expect(formSliderPresenter.vm.labelVm.label).toEqual("Label");
            expect(formSliderPresenter.vm.labelVm.value).toEqual("30");
        }

        {
            // default
            const presenter = new SliderPresenter();
            const formSliderPresenter = new FormSliderPresenter(presenter);
            formSliderPresenter.init({ label: "Label" });
            expect(formSliderPresenter.vm.labelVm.label).toEqual("Label");
            expect(formSliderPresenter.vm.labelVm.value).toEqual("0");
        }
    });

    it("should use default value if `value` and `defaultValue` are both undefined", () => {
        const presenter = new SliderPresenter();
        const formSliderPresenter = new FormSliderPresenter(presenter);
        formSliderPresenter.init({ label: "Label" });
        expect(formSliderPresenter.vm.labelVm.value).toEqual("0"); // `min` should default to 0
    });

    it("should apply the `transformValue` function if provided", () => {
        const transformValue = (value: number) => `${value}%`;
        const presenter = new SliderPresenter();
        const formSliderPresenter = new FormSliderPresenter(presenter);
        formSliderPresenter.init({ label: "Label", defaultValue: 30, transformValue });
        expect(formSliderPresenter.vm.labelVm.value).toEqual("30%");
    });

    it("should fall back to `localValue` as a string if `transformValue` is undefined", () => {
        const presenter = new SliderPresenter();
        const formSliderPresenter = new FormSliderPresenter(presenter);
        formSliderPresenter.init({ label: "Label", defaultValue: 45 });
        expect(formSliderPresenter.vm.labelVm.value).toEqual("45");
    });

    it("should update `localValue` and `labelVm.value` when `onValueChange` is called", () => {
        const presenter = new SliderPresenter();
        const formSliderPresenter = new FormSliderPresenter(presenter);
        formSliderPresenter.init({ label: "Label", defaultValue: 20 });
        formSliderPresenter.changeValue([40]);
        expect(formSliderPresenter.vm.labelVm.value).toEqual("40");
    });

    it("should handle negative values correctly", () => {
        const presenter = new SliderPresenter();
        const formSliderPresenter = new FormSliderPresenter(presenter);
        formSliderPresenter.init({ label: "Label", defaultValue: -10 });
        expect(formSliderPresenter.vm.labelVm.value).toEqual("-10");
    });
});
