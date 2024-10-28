import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { makeDecoratable } from "@webiny/react-composition";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/utils";
import { useSlider } from "./useSlider";

/**
 * Slider Root
 */
const DecoratableSliderRoot = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
    <SliderPrimitive.Root
        ref={ref}
        className={cn(
            "relative flex w-full touch-none select-none items-center cursor-pointer",
            className
        )}
        {...props}
    />
));

DecoratableSliderRoot.displayName = SliderPrimitive.Root.displayName;

const SliderRoot = makeDecoratable("SliderRoot", DecoratableSliderRoot);

/**
 * Slider Track
 */
const DecoratableSliderTrack = () => (
    <SliderPrimitive.Track className="relative h-0.5 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary data-[disabled]:opacity-50" />
    </SliderPrimitive.Track>
);

const SliderTrack = makeDecoratable("SliderTrack", DecoratableSliderTrack);

/**
 * Slider Tooltip
 */
const sliderTooltipVariants = cva(
    "bg-accent px-1.5 py-0.5 text-xs text-normal rounded absolute left-1/2 -translate-x-1/2",
    {
        variants: {
            side: {
                top: "bottom-8",
                bottom: "top-8"
            }
        },
        defaultVariants: {
            side: "bottom"
        }
    }
);

type SliderTooltipProps = VariantProps<typeof sliderTooltipVariants> & {
    value?: string;
    showTooltip?: boolean;
    tooltipSide?: "top" | "bottom";
};

const DecoratableSliderTooltip = ({ value, showTooltip, tooltipSide }: SliderTooltipProps) => {
    if (!value || !showTooltip) {
        return null;
    }

    return <div className={cn(sliderTooltipVariants({ side: tooltipSide }))}>{value}</div>;
};

const SliderTooltip = makeDecoratable("SliderTooltip", DecoratableSliderTooltip);

/**
 * Slider Thumb
 */
type SliderThumbProps = SliderTooltipProps;

const DecoratableSliderThumb = ({ value, showTooltip, tooltipSide }: SliderThumbProps) => (
    <SliderPrimitive.Thumb className="inline-block mt-1.5 h-4 w-4 rounded-full border-2 border-background bg-primary transition-colors outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
        <SliderTooltip showTooltip={showTooltip} value={value} tooltipSide={tooltipSide} />
    </SliderPrimitive.Thumb>
);

const SliderThumb = makeDecoratable("SliderThumb", DecoratableSliderThumb);

/**
 * ComposableSlider
 */
interface ComposableSliderProps {
    sliderVm: SliderPrimitive.SliderProps;
    thumbVm: SliderThumbProps;
}

const DecoratorableComposableSlider = ({ sliderVm, thumbVm }: ComposableSliderProps) => {
    return (
        <SliderRoot {...sliderVm}>
            <SliderTrack />
            <SliderThumb {...thumbVm} />
        </SliderRoot>
    );
};

const ComposableSlider = makeDecoratable("ComposableSlider", DecoratorableComposableSlider);

/**
 * Slider
 */
interface SliderProps
    extends Omit<
        SliderPrimitive.SliderProps,
        "defaultValue" | "value" | "onValueChange" | "onValueCommit"
    > {
    defaultValue?: number;
    onValueChange?(value: number): void;
    onValueCommit?(value: number): void;
    showTooltip?: boolean;
    tooltipSide?: "top" | "bottom";
    transformValue?: (value: number) => string;
    value?: number;
}

const DecoratableSlider = (props: SliderProps) => {
    const { sliderVm, thumbVm } = useSlider(props);

    return <ComposableSlider sliderVm={sliderVm} thumbVm={thumbVm} />;
};

const Slider = makeDecoratable("Slider", DecoratableSlider);

export {
    Slider,
    ComposableSlider,
    SliderRoot,
    SliderTrack,
    SliderThumb,
    type SliderProps,
    type SliderThumbProps
};
