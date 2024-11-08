import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Icon as BaseIcon } from "~/Icon";
import { cn, makeDecoratable } from "~/utils";

/**
 * Icon
 */
const iconVariants = cva("absolute transform top-1/2 -translate-y-1/2 fill-neutral-xstrong", {
    variants: {
        // Let's create dummy variants to use in combination. See `compoundVariants` here below.
        inputSize: {
            md: "",
            lg: "",
            xl: ""
        },
        position: {
            leading: "",
            trailing: ""
        },
        disabled: {
            true: "fill-neutral-disabled"
        }
    },
    defaultVariants: {
        inputSize: "md",
        position: "leading"
    },
    compoundVariants: [
        {
            inputSize: "md",
            position: "leading",
            class: "left-[calc(theme(spacing.sm-plus)-theme(borderWidth.sm))]"
        },
        {
            inputSize: "md",
            position: "trailing",
            class: "right-[calc(theme(spacing.sm-plus)-theme(borderWidth.sm))]"
        },
        {
            inputSize: "lg",
            position: "leading",
            class: "left-[calc(theme(spacing.sm-plus)-theme(borderWidth.sm))]"
        },
        {
            inputSize: "lg",
            position: "trailing",
            class: "right-[calc(theme(spacing.sm-plus)-theme(borderWidth.sm))]"
        },
        {
            inputSize: "xl",
            position: "leading",
            class: "left-[calc(theme(spacing.md)-theme(borderWidth.sm))]"
        },
        {
            inputSize: "xl",
            position: "trailing",
            class: "right-[calc(theme(spacing.md)-theme(borderWidth.sm))]"
        }
    ]
});

interface IconWrapperProps extends VariantProps<typeof iconVariants> {
    icon: React.ReactElement;
    disabled?: boolean;
}

const Icon = ({ icon, disabled, position, inputSize }: IconWrapperProps) => {
    return (
        <div className={cn(iconVariants({ position, disabled, inputSize }))}>
            {React.cloneElement(icon, {
                ...icon.props,
                size: inputSize === "xl" ? "lg" : "sm"
            })}
        </div>
    );
};

/**
 * Input
 */
const inputVariants = cva(
    [
        "flex w-full border-sm text-md",
        "focus-visible:outline-none",
        "disabled:cursor-not-allowed",
        "file:bg-transparent file:border-none file:text-sm file:font-semibold"
    ],
    {
        variants: {
            size: {
                md: [
                    "rounded-sm",
                    "py-[calc(theme(padding.xs-plus)-theme(borderWidth.sm))] px-[calc(theme(padding.sm-extra)-theme(borderWidth.sm))]"
                ],
                lg: [
                    "rounded-sm",
                    "py-[calc(theme(padding.sm-plus)-theme(borderWidth.sm))] px-[calc(theme(padding.sm-extra)-theme(borderWidth.sm))]"
                ],
                xl: [
                    "rounded-md leading-6",
                    "py-[calc(theme(padding.md)-theme(borderWidth.sm))] px-[calc(theme(padding.md)-theme(borderWidth.sm))]"
                ]
            },
            variant: {
                primary: [
                    "bg-neutral-base border-neutral-muted text-neutral-strong placeholder:text-neutral-dimmed",
                    "hover:border-neutral-strong",
                    "focus:border-neutral-black",
                    "disabled:bg-neutral-disabled disabled:border-neutral-muted disabled:text-neutral-disabled disabled:placeholder:text-neutral-disabled"
                ],
                secondary: [
                    "bg-neutral-light border-neutral-subtle text-neutral-strong placeholder:text-neutral-dimmed",
                    "hover:bg-neutral-dimmed",
                    "focus:bg-accent-default focus:border-neutral-black",
                    "disabled:bg-neutral-disabled disabled:text-neutral-disabled disabled:placeholder:text-neutral-disabled"
                ],
                ghost: [
                    "bg-neutral-base border-transparent text-neutral-strong placeholder:text-neutral-dimmed",
                    "hover:bg-neutral-light",
                    "focus:bg-neutral-light",
                    "disabled:bg-neutral-disabled disabled:text-neutral-disabled disabled:placeholder:text-neutral-disabled"
                ]
            },
            iconPosition: {
                leading: "pl-[calc(theme(padding.xl)-theme(borderWidth.sm))]",
                trailing: "pr-[calc(theme(padding.xl)-theme(borderWidth.sm))]",
                both: [
                    "pl-[calc(theme(padding.xl)-theme(borderWidth.sm))]",
                    "pr-[calc(theme(padding.xl)-theme(borderWidth.sm))]"
                ]
            },
            invalid: {
                true: [
                    "border-destructive-default",
                    "hover:border-destructive-default",
                    "focus:border-destructive-default",
                    "disabled:border-destructive-default"
                ]
            }
        },
        compoundVariants: [
            // Prevent text overlap with icons, add extra padding for icons.
            {
                size: "lg",
                iconPosition: "leading",
                class: "pl-[calc(theme(padding.xl)-theme(borderWidth.sm))]"
            },
            {
                size: "lg",
                iconPosition: "trailing",
                class: "pr-[calc(theme(padding.xl)-theme(borderWidth.sm))]"
            },
            {
                size: "lg",
                iconPosition: "both",
                class: [
                    "pl-[calc(theme(padding.xl)-theme(borderWidth.sm))]",
                    "pr-[calc(theme(padding.xl)-theme(borderWidth.sm))]"
                ]
            },
            {
                size: "xl",
                iconPosition: "leading",
                class: "pl-[calc(theme(padding.xxl)+theme(padding.xs)-theme(borderWidth.sm))]"
            },
            {
                size: "xl",
                iconPosition: "trailing",
                class: "pr-[calc(theme(padding.xxl)+theme(padding.xs)-theme(borderWidth.sm))]"
            },
            {
                size: "xl",
                iconPosition: "both",
                class: [
                    "pl-[calc(theme(padding.xxl)+theme(padding.xs)-theme(borderWidth.sm))]",
                    "pr-[calc(theme(padding.xxl)+theme(padding.xs)-theme(borderWidth.sm))]"
                ]
            },
            // Add specific classNames in case of invalid `ghost` input.
            {
                variant: "ghost",
                invalid: true,
                class: [
                    "border-none bg-destructive-subtle",
                    "hover:bg-destructive-subtle",
                    "focus:bg-destructive-subtle",
                    "disabled:bg-destructive-subtle"
                ]
            }
        ],
        defaultVariants: {
            size: "md",
            variant: "primary"
        }
    }
);

interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
        VariantProps<typeof inputVariants> {
    leadingIcon?: React.ReactElement<typeof BaseIcon>;
    trailingIcon?: React.ReactElement<typeof BaseIcon>;
    maxLength?: React.InputHTMLAttributes<HTMLInputElement>["size"];
}

const getIconPosition = (
    leadingIcon?: InputProps["leadingIcon"],
    trailingIcon?: InputProps["trailingIcon"]
): "leading" | "trailing" | "both" | undefined => {
    if (leadingIcon && trailingIcon) {
        return "both";
    }
    if (leadingIcon) {
        return "leading";
    }
    if (trailingIcon) {
        return "trailing";
    }
    return;
};

const DecoratableInput = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            disabled,
            invalid,
            leadingIcon,
            maxLength,
            size,
            trailingIcon,
            variant,
            ...props
        },
        ref
    ) => {
        const iconPosition = getIconPosition(leadingIcon, trailingIcon);

        return (
            <div className={"relative flex items-center"}>
                {leadingIcon && (
                    <Icon
                        disabled={disabled}
                        icon={leadingIcon}
                        inputSize={size}
                        position={"leading"}
                    />
                )}
                <input
                    className={cn(
                        inputVariants({ variant, size, className, iconPosition, invalid })
                    )}
                    ref={ref}
                    disabled={disabled}
                    size={maxLength}
                    {...props}
                />
                {trailingIcon && (
                    <Icon
                        disabled={disabled}
                        icon={trailingIcon}
                        inputSize={size}
                        position={"trailing"}
                    />
                )}
            </div>
        );
    }
);
DecoratableInput.displayName = "Input";

const Input = makeDecoratable("Input", DecoratableInput);

export { Input, type InputProps };
