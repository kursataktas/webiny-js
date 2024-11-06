import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, makeDecoratable } from "~/utils";

const inputVariants = cva(
    "flex w-full border-sm text-md file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none disabled:cursor-not-allowed",
    {
        variants: {
            size: {
                md: "h-8 py-xs-plus pl-sm-extra pr-sm-plus rounded-sm",
                lg: "h-10 py-sm-plus px-sm-extra rounded-sm",
                xl: "h-14 p-md pr-md-plus rounded-md"
            },
            variant: {
                primary: [
                    "bg-neutral-base border-neutral-muted placeholder-neutral-dimmed text-neutral-strong",
                    "hover:border-neutral-strong",
                    "focus:border-neutral-black",
                    "disabled:bg-neutral-disabled disabled:border-neutral-muted disabled:placeholder-neutral-disabled disabled:text-neutral-disabled"
                ],
                secondary: [
                    "bg-neutral-light border-none placeholder-neutral-dimmed text-neutral-strong",
                    "hover:bg-neutral-dimmed",
                    "focus:bg-neutral-base focus:border-sm focus:border-neutral-black", // Missing border color token for white border colors
                    "disabled:bg-neutral-disabled disabled:placeholder-neutral-disabled disabled:text-neutral-disabled" // Wrong text color token.
                ],
                quiet: [""]
            }
        },
        defaultVariants: {
            size: "md",
            variant: "primary"
        }
    }
);

interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
        VariantProps<typeof inputVariants> {}

const DecoratableInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, variant, size, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(inputVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
DecoratableInput.displayName = "Input";

const Input = makeDecoratable("Input", DecoratableInput);

export { Input, type InputProps };
