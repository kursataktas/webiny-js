import { useEffect, useMemo, useState } from "react";
import { autorun } from "mobx";
import { SelectProps } from "./Select";
import { SelectPresenter } from "./SelectPresenter";

export const useSelect = (props: SelectProps) => {
    const presenter = useMemo(() => new SelectPresenter(), []);

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
