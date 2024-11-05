import * as React from "react";
import { ReactComponent as ChevronUp } from "@material-design-icons/svg/outlined/keyboard_arrow_up.svg";
import { ReactComponent as ChevronDown } from "@material-design-icons/svg/outlined/keyboard_arrow_down.svg";
import { ReactComponent as Check } from "@material-design-icons/svg/outlined/check.svg";
import { makeDecoratable } from "@webiny/react-composition";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/utils";
import { useSelect } from "./useSelect";
import { SelectOptionDto } from "~/Select/SelectOptionDto";
import { SelectOptionFormatted } from "~/Select/SelectOptionFormatted";

type SelectVm = SelectPrimitive.SelectProps;

const SelectRoot = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

/**
 * Trigger
 */

const triggerVariants = cva(
    "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
    {
        variants: {
            variant: {
                primary:
                    "bg-primary text-primary-foreground hover:bg-primary/90 [&>svg]:fill-white",
                secondary:
                    "bg-gray-200 text-gray-900 fill-gray-900 border border-gray-200 hover:bg-gray-300 hover:border-gray-300 hover:text-gray-800",
                quiet: "bg-white text-gray-900 fill-gray-900 border border-gray-400 hover:bg-gray-100 hover:text-gray-900"
            },
            size: {
                md: "py-1.5 px-2 rounded text-md font-normal",
                lg: "py-2.5 px-3 rounded-lg text-base font-medium",
                xl: "py-3.5 px-4 rounded-lg text-lg font-medium"
            }
        },
        defaultVariants: {
            variant: "primary",
            size: "md"
        }
    }
);

interface TriggerProps
    extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
        VariantProps<typeof triggerVariants> {}

const DecoratableTrigger = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Trigger>,
    TriggerProps
>(({ className, children, size, variant, ...props }, ref) => (
    <SelectPrimitive.Trigger
        ref={ref}
        className={cn(triggerVariants({ variant, size, className }))}
        {...props}
    >
        {children}
        <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
));
DecoratableTrigger.displayName = SelectPrimitive.Trigger.displayName;

const Trigger = makeDecoratable("Trigger", DecoratableTrigger);

/**
 * SelectScrollUpButton
 */
const DecoratableSelectScrollUpButton = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollUpButton
        ref={ref}
        className={cn("flex cursor-default items-center justify-center py-1", className)}
        {...props}
    >
        <ChevronUp className="h-4 w-4" />
    </SelectPrimitive.ScrollUpButton>
));
DecoratableSelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollUpButton = makeDecoratable(
    "SelectScrollUpButton",
    DecoratableSelectScrollUpButton
);

/**
 * SelectScrollDownButton
 */
const DecoratableSelectScrollDownButton = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollDownButton
        ref={ref}
        className={cn("flex cursor-default items-center justify-center py-1", className)}
        {...props}
    >
        <ChevronDown className="h-4 w-4" />
    </SelectPrimitive.ScrollDownButton>
));
DecoratableSelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectScrollDownButton = makeDecoratable(
    "SelectScrollDownButton",
    DecoratableSelectScrollDownButton
);

/**
 * SelectContent
 */
const DecoratableSelectContent = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
    <SelectPrimitive.Portal>
        <SelectPrimitive.Content
            ref={ref}
            className={cn(
                "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                position === "popper" &&
                    "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                className
            )}
            position={position}
            {...props}
        >
            <SelectScrollUpButton />
            <SelectPrimitive.Viewport
                className={cn(
                    "p-1",
                    position === "popper" &&
                        "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
                )}
            >
                {children}
            </SelectPrimitive.Viewport>
            <SelectScrollDownButton />
        </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
));
DecoratableSelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectContent = makeDecoratable("SelectContent", DecoratableSelectContent);

/**
 * SelectLabel
 */
const DecoratableSelectLabel = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.Label
        ref={ref}
        className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
        {...props}
    />
));
DecoratableSelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectLabel = makeDecoratable("SelectLabel", DecoratableSelectLabel);

/**
 * SelectItem
 */
const DecoratableSelectItem = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
        ref={ref}
        className={cn(
            "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            className
        )}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <SelectPrimitive.ItemIndicator>
                <Check className="h-4 w-4" />
            </SelectPrimitive.ItemIndicator>
        </span>

        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
));
DecoratableSelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectItem = makeDecoratable("SelectItem", DecoratableSelectItem);

/**
 * SelectSeparator
 */
const DecoratableSelectSeparator = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.Separator
        ref={ref}
        className={cn("-mx-1 my-1 h-px bg-muted", className)}
        {...props}
    />
));
DecoratableSelectSeparator.displayName = SelectPrimitive.Separator.displayName;

const SelectSeparator = makeDecoratable("SelectSeparator", DecoratableSelectSeparator);

/**
 * Trigger
 */
type SelectTriggerVm = SelectPrimitive.SelectValueProps & {
    size: VariantProps<typeof triggerVariants>["size"];
    variant: VariantProps<typeof triggerVariants>["variant"];
};

const DecoratableSelectTrigger = ({ size, variant, ...props }: SelectTriggerVm) => {
    return (
        <Trigger size={size} variant={variant}>
            <SelectValue {...props} />
        </Trigger>
    );
};

const SelectTrigger = makeDecoratable("SelectTrigger", DecoratableSelectTrigger);

/**
 * SelectOptions
 */
interface SelectOptionsVm {
    options: SelectOptionFormatted[];
}

const DecoratableSelectOptions = (props: SelectOptionsVm) => {
    const renderOptions = React.useCallback((items: SelectOptionFormatted[]) => {
        return items.map((item, index) => {
            const elements = [];

            if (item.options.length > 0) {
                // Render as a group if there are nested options
                elements.push(
                    <SelectGroup key={`group-${index}`}>
                        <SelectLabel>{item.label}</SelectLabel>
                        {renderOptions(item.options)}
                    </SelectGroup>
                );
            }

            if (item.value) {
                // Render as a select item if there are no nested options
                elements.push(
                    <SelectItem
                        key={`item-${item.value}`}
                        value={item.value}
                        disabled={item.disabled}
                    >
                        {item.label}
                    </SelectItem>
                );
            }

            // Conditionally render the separator if hasSeparator is true
            if (item.separator) {
                elements.push(<SelectSeparator key={`separator-${item.value ?? index}`} />);
            }

            return elements;
        });
    }, []);

    return <SelectContent>{renderOptions(props.options)}</SelectContent>;
};

const SelectOptions = makeDecoratable("SelectOptions", DecoratableSelectOptions);

/**
 * SelectRenderer
 */
interface SelectRendererProps {
    selectVm: SelectVm;
    selectTriggerVm: SelectTriggerVm;
    selectOptionsVm: SelectOptionsVm;
    onValueChange: (value: string) => void;
}

const DecoratableSelectRenderer = ({
    selectVm,
    selectTriggerVm,
    selectOptionsVm,
    onValueChange
}: SelectRendererProps) => {
    return (
        <SelectRoot {...selectVm} onValueChange={onValueChange}>
            <SelectTrigger {...selectTriggerVm} />
            <SelectOptions {...selectOptionsVm} />
        </SelectRoot>
    );
};

const SelectRenderer = makeDecoratable("SelectRenderer", DecoratableSelectRenderer);

/**
 * Select
 */
type SelectOption = SelectOptionDto | string;

type SelectProps = SelectPrimitive.SelectProps & {
    placeholder?: string;
    onValueChange: (value: string) => void;
    options?: SelectOption[];
    size?: VariantProps<typeof triggerVariants>["size"];
    variant?: VariantProps<typeof triggerVariants>["variant"];
};

const DecoratableSelect = (props: SelectProps) => {
    const { vm, changeValue } = useSelect(props);

    return (
        <SelectRenderer
            selectVm={vm.selectVm}
            selectTriggerVm={vm.selectTriggerVm}
            selectOptionsVm={vm.selectOptionsVm}
            onValueChange={changeValue}
        />
    );
};

const Select = makeDecoratable("Select", DecoratableSelect);

export {
    Select,
    SelectRenderer,
    type SelectOptionsVm,
    type SelectProps,
    type SelectTriggerVm,
    type SelectVm
};
