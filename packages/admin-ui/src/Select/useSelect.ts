import { useEffect, useMemo, useState } from "react";
import { autorun } from "mobx";
import { SelectProps } from "./Select";
import { SelectPresenter } from "./SelectPresenter";

export const useSelect = (props: SelectProps) => {
    const presenter = useMemo(() => new SelectPresenter(props), [JSON.stringify(props)]);
    const [selectVm, setSelectVm] = useState(presenter.selectVm);
    const [selectTriggerVm, setSelectTriggerVm] = useState(presenter.selectTriggerVm);
    const [selectOptionsVm, setSelectOptionsVm] = useState(presenter.selectOptionsVm);

    useEffect(() => {
        const dispose = autorun(() => {
            setSelectVm(presenter.selectVm);
            setSelectTriggerVm(presenter.selectTriggerVm);
            setSelectOptionsVm(presenter.selectOptionsVm);
        });
        return () => dispose(); // Cleanup on unmount
    }, [presenter]);

    return { selectVm, selectTriggerVm, selectOptionsVm };
};
