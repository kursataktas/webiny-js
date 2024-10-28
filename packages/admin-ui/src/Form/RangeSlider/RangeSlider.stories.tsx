import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RangeSlider } from "./RangeSlider";

const meta: Meta<typeof RangeSlider> = {
    title: "Components/Form/RangeSlider",
    component: RangeSlider,
    tags: ["autodocs"],
    argTypes: {
        onValueChange: { action: "onValueChange" },
        onValueCommit: { action: "onValueCommit" }
    },
    parameters: {
        layout: "fullscreen"
    },
    decorators: [
        Story => (
            <div className="w-[60%] h-32 mx-auto flex justify-center items-center">
                <Story />
            </div>
        )
    ]
};

export default meta;
type Story = StoryObj<typeof RangeSlider>;

export const Default: Story = {
    args: {
        label: "Label"
    }
};

export const WithDefaultValues: Story = {
    args: {
        label: "Label",
        defaultValue: [25, 75]
    }
};

export const WithMinAndMaxValues: Story = {
    args: {
        label: "Label",
        min: 25,
        max: 75
    }
};

export const WithSteps: Story = {
    args: {
        label: "Label",
        step: 10
    }
};

export const Disabled: Story = {
    args: {
        label: "Label",
        disabled: true,
        defaultValue: [25, 75]
    }
};

export const WithTooltip: Story = {
    args: {
        label: "Label",
        showTooltip: true
    }
};

export const WithTooltipSideTop: Story = {
    args: {
        label: "Label",
        showTooltip: true,
        tooltipSide: "top"
    }
};

export const WithCustomValueConverter: Story = {
    args: {
        label: "Label",
        transformValues: (value: number) => {
            return `${Math.round(value)}%`;
        }
    }
};

export const WithCustomValueConverterAndTooltip: Story = {
    args: {
        label: "Label",
        showTooltip: true,
        transformValues: (value: number) => {
            return `${Math.round(value)}%`;
        }
    }
};

export const WithExternalValueControl: Story = {
    args: {
        label: "Label"
    },
    render: args => {
        const [value, setValue] = useState([0, 100]);
        return (
            <div className={"w-full"}>
                <div>
                    <RangeSlider {...args} value={value} onValueChange={value => setValue(value)} />
                </div>
                <div className={"mt-4 text-center"}>
                    <button onClick={() => setValue([0, 100])}>{"Reset"}</button>
                </div>
            </div>
        );
    }
};
