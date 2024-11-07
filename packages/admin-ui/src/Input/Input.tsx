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
            class: "left-sm-plus"
        },
        {
            inputSize: "md",
            position: "trailing",
            class: "right-sm-plus"
        },
        {
            inputSize: "lg",
            position: "leading",
            class: "left-sm-plus"
        },
        {
            inputSize: "lg",
            position: "trailing",
            class: "right-sm-plus"
        },
        {
            inputSize: "xl",
            position: "leading",
            class: "left-md"
        },
        {
            inputSize: "xl",
            position: "trailing",
            class: "right-md"
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
    "flex w-full border-sm text-md file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none disabled:cursor-not-allowed",
    {
        variants: {
            size: {
                md: "h-8 py-xs-plus px-sm-extra rounded-sm",
                lg: "h-10 py-sm-plus px-sm-extra rounded-sm",
                xl: "h-14 p-md rounded-md"
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
                    "bg-neutral-base border-none text-neutral-strong placeholder:text-neutral-dimmed",
                    "hover:bg-neutral-light",
                    "focus:bg-neutral-light",
                    "disabled:bg-neutral-disabled disabled:text-neutral-disabled disabled:placeholder:text-neutral-disabled"
                ]
            },
            iconPosition: {
                leading: "pl-xl",
                trailing: "pr-xl",
                both: "pl-xl pr-xl"
            },
            invalid: {
                true: "border-destructive-default hover:border-destructive-default focus:border-destructive-default disabled:border-destructive-default"
            }
        },

        compoundVariants: [
            // Prevent text overlap with icons, add extra padding for icons.
            {
                size: "lg",
                iconPosition: "leading",
                class: "pl-xl"
            },
            {
                size: "lg",
                iconPosition: "trailing",
                class: "pr-xl"
            },
            {
                size: "lg",
                iconPosition: "both",
                class: "pl-xl pr-xl"
            },
            {
                size: "xl",
                iconPosition: "leading",
                class: "pl-xxl"
            },
            {
                size: "xl",
                iconPosition: "trailing",
                class: "pr-xxl"
            },
            {
                size: "xl",
                iconPosition: "both",
                class: "pl-xxl pr-xxl"
            },
            // Add specific classNames in case of invalid `ghost` input.
            {
                variant: "ghost",
                invalid: true,
                class: "border-none bg-destructive-subtle hover:bg-destructive-subtle focus:bg-destructive-subtle disabled:bg-destructive-subtle"
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
