import React from "react";
import { FORMAT_TEXT_COMMAND } from "lexical";
import { useCurrentSelection } from "~/hooks/useCurrentSelection";
import { useRichTextEditor } from "~/hooks";

export const BoldAction = () => {
    const { editor } = useRichTextEditor();
    const { rangeSelection } = useCurrentSelection();
    const isBoldSelected = rangeSelection ? rangeSelection.hasFormat("bold") : false;

    const handleClick = () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
    };

    return (
        <button
            onClick={handleClick}
            className={"popup-item spaced " + (isBoldSelected ? "active" : "")}
            aria-label="Format text as bold"
        >
            <i className="format bold" />
        </button>
    );
};
