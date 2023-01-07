import React, { useRef, useState } from "react";
import { EditorStateJSONString } from "../../types";
import { Placeholder } from "~/ui/Placeholder";
import {getEmptyEditorStateJSONString} from "~/utils/getEmptyEditorStateJSONString";
import { WebinyNodes } from "~/nodes/webinyNodes";
import { theme } from "~/themes/webinyLexicalTheme";
import {EditorState} from "lexical/LexicalEditorState";
import {LexicalEditor} from "lexical";
import {LexicalComposer} from "@lexical/react/LexicalComposer";
import {OnChangePlugin} from "@lexical/react/LexicalOnChangePlugin";
import {AutoFocusPlugin} from "@lexical/react/LexicalAutoFocusPlugin";
import {ClearEditorPlugin} from "@lexical/react/LexicalClearEditorPlugin";
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { makeComposable } from "@webiny/react-composition";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";

export interface RichTextEditorProps  {

    toolbar: React.ReactNode,
    /**
     * @description Specify the html tag that this editor and toolbar action will be visible.
     */
    tag: string,
    onChange?: (json: EditorStateJSONString) => void;
    value: EditorStateJSONString | undefined | null;
    placeholder?: string;
    /**
     * @description Lexical plugins
     */
    children?: React.ReactNode | React.ReactNode[];
}

const BaseRichTextEditor: React.FC<RichTextEditorProps> = ({ toolbar, onChange, value, placeholder, children }: RichTextEditorProps) => {
    const placeholderElem = <Placeholder>{placeholder || "Enter text..."}</Placeholder>;
    const scrollRef = useRef(null);
    const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLElement | undefined>(
        undefined
    );

    const onRef = (_floatingAnchorElem: HTMLDivElement) => {
        if (_floatingAnchorElem !== null) {
            setFloatingAnchorElem(_floatingAnchorElem);
        }
    };

    const initialConfig = {
        editorState: value ?? getEmptyEditorStateJSONString(),
        namespace: "webiny",
        onError: (error: Error) => {
            throw error;
        },
        nodes: [...WebinyNodes],
        theme: theme
    };

    function handleOnChange(editorState: EditorState, editor: LexicalEditor) {
        editorState.read(() => {
            if (typeof onChange === "function") {
                const editorState = editor.getEditorState();
                onChange(JSON.stringify(editorState.toJSON()));
            }
        });
    }

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div ref={scrollRef}>
                <OnChangePlugin onChange={handleOnChange} />
                <AutoFocusPlugin />
                <ClearEditorPlugin />
                {children}
                <RichTextPlugin
                    contentEditable={
                        <div className="editor-scroller">
                            <div className="editor" ref={onRef}>
                                <ContentEditable />
                            </div>
                        </div>
                    }
                    placeholder={placeholderElem}
                    ErrorBoundary={LexicalErrorBoundary}
                />
                {floatingAnchorElem && (
                    toolbar
                )}
            </div>
        </LexicalComposer>
    );
}

/**
 * @description Main editor container
 */
export const RichTextEditor = makeComposable<RichTextEditorProps>(
    "RichTextEditor",
    (props): JSX.Element | null => {
       return <BaseRichTextEditor {...props} />
    }
);
