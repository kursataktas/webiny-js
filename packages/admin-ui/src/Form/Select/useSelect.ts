import { useEffect, useMemo, useState } from "react";
import { autorun } from "mobx";
import { SelectProps } from "./Select";
import { FormSelectPresenter } from "./SelectPresenter";
import { SelectPresenter } from "~/Select";

export const useSelect = (props: SelectProps) => {
    const presenter = useMemo(() => {
        const selectPresenter = new SelectPresenter();
        return new FormSelectPresenter(selectPresenter);
    }, []);

    const [vm, setVm] = useState(presenter.vm);

    useEffect(() => {
        presenter.init(props);
    }, [props]);

    useEffect(() => {
        return autorun(() => {
            setVm(presenter.vm);
        });
    }, [presenter]);

    return { vm, changeValue: presenter.changeValue };
};
