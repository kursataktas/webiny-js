import { FormSelectPresenter } from "./SelectPresenter";
import { SelectPresenter } from "~/Select/SelectPresenter";

describe("FormSelectPresenter", () => {
    const onValueChange = jest.fn();

    it("should return the compatible `labelVm` based on props", () => {
        {
            // `label`
            const presenter = new SelectPresenter();
            const formSelectPresenter = new FormSelectPresenter(presenter);
            formSelectPresenter.init({ label: "Label", onValueChange });
            expect(formSelectPresenter.vm.selectLabelVm.label).toEqual("Label");
        }
    });

    it("should call `onValueChange` callback when `changeValue` is called", () => {
        const presenter = new SelectPresenter();
        const formSelectPresenter = new FormSelectPresenter(presenter);
        formSelectPresenter.init({ label: "Label", onValueChange });
        formSelectPresenter.changeValue("value");
        expect(onValueChange).toHaveBeenCalledWith("value");
    });
});
