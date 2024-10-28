import { FormSliderPresenter } from "./SliderPresenter";
import { SliderPresenter } from "~/Slider";

describe("FormSliderPresenter", () => {
    it("should return the compatible `labelVm` based on props", () => {
        {
            // `defaultValue`
            const presenter = new SliderPresenter({ defaultValue: 50 });
            const formSliderPresenter = new FormSliderPresenter(
                { label: "Label", defaultValue: 50 },
                presenter
            );
            expect(formSliderPresenter.labelVm.label).toEqual("Label");
            expect(formSliderPresenter.labelVm.value).toEqual("50");
        }

        {
            // `value`
            const presenter = new SliderPresenter({ value: 50 });
            const formSliderPresenter = new FormSliderPresenter(
                { label: "Label", value: 50 },
                presenter
            );
            expect(formSliderPresenter.labelVm.label).toEqual("Label");
            expect(formSliderPresenter.labelVm.value).toEqual("50");
        }

        {
            // `min`
            const presenter = new SliderPresenter({ min: 50 });
            const formSliderPresenter = new FormSliderPresenter(
                { label: "Label", min: 50 },
                presenter
            );
            expect(formSliderPresenter.labelVm.label).toEqual("Label");
            expect(formSliderPresenter.labelVm.value).toEqual("50");
        }

        {
            // default
            const presenter = new SliderPresenter({});
            const formSliderPresenter = new FormSliderPresenter({ label: "Label" }, presenter);
            expect(formSliderPresenter.labelVm.label).toEqual("Label");
            expect(formSliderPresenter.labelVm.value).toEqual("0");
        }
    });

    it("should use default value if `value` and `defaultValue` are both undefined", () => {
        const presenter = new SliderPresenter({});
        const formSliderPresenter = new FormSliderPresenter({ label: "Label" }, presenter);

        expect(formSliderPresenter.labelVm.value).toEqual("0"); // `min` should default to 0
    });

    it("should apply the `transformValue` function if provided", () => {
        const transformValue = (value: number) => `${value}%`;
        const presenter = new SliderPresenter({});
        const formSliderPresenter = new FormSliderPresenter(
            { label: "Label", defaultValue: 30, transformValue },
            presenter
        );

        expect(formSliderPresenter.labelVm.value).toEqual("30%");
    });

    it("should fall back to `localValue` as a string if `transformValue` is undefined", () => {
        const presenter = new SliderPresenter({});
        const formSliderPresenter = new FormSliderPresenter(
            { label: "Label", defaultValue: 45 },
            presenter
        );

        expect(formSliderPresenter.labelVm.value).toEqual("45");
    });

    it("should update `localValue` and `labelVm.value` when `onValueChange` is called", () => {
        const presenter = new SliderPresenter({});
        const formSliderPresenter = new FormSliderPresenter(
            { label: "Label", defaultValue: 20 },
            presenter
        );

        formSliderPresenter.sliderVm.onValueChange([40]);
        expect(formSliderPresenter.labelVm.value).toEqual("40");
    });

    it("should handle negative values correctly", () => {
        const presenter = new SliderPresenter({});
        const formSliderPresenter = new FormSliderPresenter(
            { label: "Label", defaultValue: -10 },
            presenter
        );

        expect(formSliderPresenter.labelVm.value).toEqual("-10");
    });
});
