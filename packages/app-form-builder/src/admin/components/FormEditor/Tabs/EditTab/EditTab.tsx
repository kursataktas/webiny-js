import React, { useCallback, useState } from "react";
import { Icon } from "@webiny/ui/Icon";
import { cloneDeep } from "lodash";
import { Center, Vertical, Horizontal } from "../../DropZone";
import Draggable from "../../Draggable";
import EditFieldDialog from "./EditFieldDialog";
import Field from "./Field";
import { ReactComponent as HandleIcon } from "../../../../icons/round-drag_indicator-24px.svg";
import { rowHandle, EditContainer, fieldHandle, fieldContainer, Row, RowContainer } from "./Styled";
import { useFormEditor } from "../../Context";
import { FbFormModelField, FieldLayoutPositionType } from "~/types";
import { i18n } from "@webiny/app/i18n";

const t = i18n.namespace("FormsApp.Editor.EditTab");

export const EditTab: React.FC = () => {
    const {
        getLayoutFields,
        insertField,
        updateField,
        deleteField,
        data,
        moveField,
        moveRow,
        getFieldPlugin
    } = useFormEditor();
    const [editingField, setEditingField] = useState<FbFormModelField | null>(null);
    const [dropTarget, setDropTarget] = useState<FieldLayoutPositionType | null>(null);

    const editField = useCallback((field: FbFormModelField | null) => {
        if (!field) {
            setEditingField(null);
            return;
        }
        setEditingField(cloneDeep(field));
    }, []);

    // TODO @ts-refactor figure out source type
    const handleDropField = useCallback(
        (source: any, position: FieldLayoutPositionType): void => {
            const { pos, name, ui } = source;

            if (name === "custom") {
                /**
                 * We can cast because field is empty in the start
                 */
                editField({} as FbFormModelField);
                setDropTarget(position);
                return;
            }

            if (ui === "row") {
                // Reorder rows.
                // Reorder logic is different depending on the source and target position.
                moveRow(pos.row, position.row);
                return;
            }

            // If source pos is set, we are moving an existing field.
            if (pos) {
                if (pos.index === null) {
                    console.log("Tried to move Form Field but its position index is null.");
                    console.log(source);
                    return;
                }
                const fieldId = data.layout[pos.row][pos.index];
                moveField({
                    field: fieldId,
                    position
                });
                return;
            }

            // Find field plugin which handles the dropped field type "name".
            const plugin = getFieldPlugin({ name });
            if (!plugin) {
                return;
            }
            insertField(plugin.field.createField(), position);
        },
        [data]
    );

    const fields = getLayoutFields();

    return (
        <EditContainer>
            {fields.length === 0 && (
                <Center
                    onDrop={item => {
                        handleDropField(item, {
                            row: 0,
                            index: 0
                        });
                        return undefined;
                    }}
                >
                    {t`Drop your first field here`}
                </Center>
            )}

            {fields.map((row, index) => (
                <Draggable beginDrag={{ ui: "row", pos: { row: index } }} key={`row-${index}`}>
                    {(
                        {
                            drag,
                            isDragging
                        } /* RowContainer start - includes drag handle, drop zones and the Row itself. */
                    ) => (
                        <RowContainer style={{ opacity: isDragging ? 0.3 : 1 }}>
                            <div className={rowHandle} ref={drag}>
                                <Icon icon={<HandleIcon />} />
                            </div>
                            <Horizontal
                                onDrop={item => {
                                    handleDropField(item, {
                                        row: index,
                                        index: null
                                    });
                                    return undefined;
                                }}
                            />
                            {/* Row start - includes field drop zones and fields */}
                            <Row>
                                {row.map((field, fieldIndex) => (
                                    <Draggable
                                        key={`field-${fieldIndex}`}
                                        beginDrag={{
                                            ui: "field",
                                            name: field.name,
                                            pos: {
                                                row: index,
                                                index: fieldIndex
                                            }
                                        }}
                                    >
                                        {({ drag }) => (
                                            <div className={fieldContainer} ref={drag}>
                                                <Vertical
                                                    onDrop={item => {
                                                        handleDropField(item, {
                                                            row: index,
                                                            index: fieldIndex
                                                        });
                                                        return undefined;
                                                    }}
                                                    isVisible={item =>
                                                        item.ui === "field" &&
                                                        (row.length < 4 || item?.pos?.row === index)
                                                    }
                                                />

                                                <div className={fieldHandle}>
                                                    <Field
                                                        field={field}
                                                        onEdit={editField}
                                                        onDelete={deleteField}
                                                    />
                                                </div>

                                                {/* Field end */}
                                                {fieldIndex === row.length - 1 && (
                                                    <Vertical
                                                        last
                                                        isVisible={item =>
                                                            item.ui === "field" &&
                                                            (row.length < 4 ||
                                                                item?.pos?.row === index)
                                                        }
                                                        onDrop={item => {
                                                            handleDropField(item, {
                                                                row: index,
                                                                index: fieldIndex + 1
                                                            });
                                                            return undefined;
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                            </Row>
                            {/* Row end */}
                            {index === fields.length - 1 && (
                                <Horizontal
                                    last
                                    onDrop={item => {
                                        handleDropField(item, {
                                            row: index + 1,
                                            index: null
                                        });
                                        return undefined;
                                    }}
                                />
                            )}
                        </RowContainer>
                    )}
                </Draggable>
            ))}

            <EditFieldDialog
                field={editingField}
                onClose={editField}
                onSubmit={data => {
                    if (data._id) {
                        updateField(data as unknown as FbFormModelField);
                    } else if (!dropTarget) {
                        console.log("Missing drop target on EditFieldDialog submit.");
                    } else {
                        insertField(data as unknown as FbFormModelField, dropTarget);
                    }
                    editField(null);
                }}
            />
        </EditContainer>
    );
};
