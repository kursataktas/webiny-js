import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "./Slider";

const meta: Meta<typeof Slider> = {
    title: "Components/Form/Slider",
    component: Slider,
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
    ],
    render: args => {
        const [value, setValue] = useState(args.value);
        return <Slider {...args} value={value} onValueChange={value => setValue(value)} />;
    }
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
    args: {
        label: "Label"
    }
};

export const WithDefaultValue: Story = {
    args: {
        label: "Label",
        value: 50
    }
};

export const WithMinAndMaxValues: Story = {
    args: {
        label: "Label",
        min: 10,
        max: 20
    }
};

export const WithNegativeMinValue: Story = {
    args: {
        label: "Label",
        min: -100,
        max: 100,
        value: 0
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
        value: 50
    }
};

export const WithSideLabel: Story = {
    args: {
        label: "Label",
        labelPosition: "side"
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

export const WithSideLabelAndTooltip: Story = {
    args: {
        label: "Label",
        showTooltip: true,
        labelPosition: "side"
    }
};

export const WithCustomValueConverter: Story = {
    args: {
        label: "Label",
        transformValue: (value: number) => {
            return `${Math.round(value)}%`;
        }
    }
};

export const WithCustomValueConverterAndTooltip: Story = {
    args: {
        label: "Label",
        showTooltip: true,
        transformValue: (value: number) => {
            return `${Math.round(value)}%`;
        }
    }
};

export const WithExternalValueControl: Story = {
    args: {
        label: "Label"
    },
    render: args => {
        const defaultValue = 50;
        const [value, setValue] = useState(defaultValue);
        return (
            <div className={"w-full"}>
                <div>
                    <Slider {...args} value={value} onValueChange={value => setValue(value)} />
                </div>
                <div className={"mt-4 text-center"}>
                    <button onClick={() => setValue(defaultValue)}>{"Reset"}</button>
                </div>
            </div>
        );
    }
};
