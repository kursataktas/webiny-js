import { SelectPresenter } from "./SelectPresenter";

describe("SelectPresenter", () => {
    const onValueChange = jest.fn();

    it("should return the compatible `selectVm` based on props", () => {
        // `value`
        {
            const presenter = new SelectPresenter();
            presenter.init({ onValueChange, value: "Value 1" });
            expect(presenter.vm.selectVm.value).toEqual("Value 1");
        }

        // `open`
        {
            const presenter = new SelectPresenter();
            presenter.init({ onValueChange, open: true });
            expect(presenter.vm.selectVm.open).toEqual(true);
        }

        // `disabled`
        {
            const presenter = new SelectPresenter();
            presenter.init({ onValueChange, disabled: true });
            expect(presenter.vm.selectVm.disabled).toEqual(true);
        }

        {
            // default: no props
            const presenter = new SelectPresenter();
            presenter.init({ onValueChange });
            expect(presenter.vm.selectVm.value).toEqual(undefined);
            expect(presenter.vm.selectVm.open).toEqual(undefined);
            expect(presenter.vm.selectVm.disabled).toEqual(undefined);
        }
    });

    it("should return the compatible `selectTriggerVm` based on props", () => {
        const onValueChange = jest.fn();

        // `placeholder`
        {
            const presenter = new SelectPresenter();
            presenter.init({ onValueChange, placeholder: "Custom placeholder" });
            expect(presenter.vm.selectTriggerVm.placeholder).toEqual("Custom placeholder");
        }

        {
            // default: no props
            const presenter = new SelectPresenter();
            presenter.init({ onValueChange });
            expect(presenter.vm.selectTriggerVm.placeholder).toEqual("Choose a value");
        }
    });

    it("should return the compatible `selectOptionsVm` based on props", () => {
        // with `options` as string
        {
            const presenter = new SelectPresenter();
            presenter.init({ onValueChange, options: ["Option 1", "Option 2"] });
            expect(presenter.vm.selectOptionsVm.options).toEqual([
                {
                    value: "Option 1",
                    label: "Option 1",
                    options: [],
                    disabled: false,
                    separator: false
                },
                {
                    value: "Option 2",
                    label: "Option 2",
                    options: [],
                    disabled: false,
                    separator: false
                }
            ]);
        }

        // with `options` as formatted options
        {
            const presenter = new SelectPresenter();
            presenter.init({
                onValueChange,
                options: [
                    {
                        value: "option-1",
                        label: "Option 1"
                    },
                    {
                        value: "option-2",
                        label: "Option 2",
                        options: [
                            {
                                value: "option-3",
                                label: "Option 3",
                                options: [{ value: "option-4", label: "Option 4" }]
                            }
                        ]
                    },
                    {
                        value: "option-5",
                        label: "Option 5",
                        disabled: true
                    },
                    {
                        value: "option-6",
                        label: "Option 6",
                        separator: true
                    }
                ]
            });
            expect(presenter.vm.selectOptionsVm.options).toEqual([
                {
                    value: "option-1",
                    label: "Option 1",
                    options: [],
                    disabled: false,
                    separator: false
                },
                {
                    value: "option-2",
                    label: "Option 2",
                    options: [
                        {
                            value: "option-3",
                            label: "Option 3",
                            options: [
                                {
                                    value: "option-4",
                                    label: "Option 4",
                                    options: [],
                                    disabled: false,
                                    separator: false
                                }
                            ],
                            disabled: false,
                            separator: false
                        }
                    ],
                    disabled: false,
                    separator: false
                },
                {
                    value: "option-5",
                    label: "Option 5",
                    options: [],
                    disabled: true,
                    separator: false
                },
                {
                    value: "option-6",
                    label: "Option 6",
                    options: [],
                    disabled: false,
                    separator: true
                }
            ]);
        }
    });

    it("should call `onValueChange` callback when `changeValue` is called", () => {
        const presenter = new SelectPresenter();
        presenter.init({ onValueChange, value: "value" });
        presenter.changeValue("value-2");
        expect(onValueChange).toHaveBeenCalledWith("value-2");
    });
});
