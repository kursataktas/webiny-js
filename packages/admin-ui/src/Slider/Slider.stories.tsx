import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "./Slider";

const meta: Meta<typeof Slider> = {
    title: "Components/Slider",
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
    ]
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {};

export const WithDefaultValue: Story = {
    args: {
        defaultValue: 50
    }
};

export const WithMinAndMaxValues: Story = {
    args: {
        min: 10,
        max: 20
    }
};

export const WithNegativeMinValue: Story = {
    args: {
        min: -100,
        max: 100,
        defaultValue: 0
    }
};

export const WithSteps: Story = {
    args: {
        step: 10
    }
};

export const Disabled: Story = {
    args: {
        disabled: true,
        defaultValue: 50
    }
};

export const WithTooltip: Story = {
    args: {
        showTooltip: true
    }
};

export const WithTooltipSideTop: Story = {
    args: {
        showTooltip: true,
        tooltipSide: "top"
    }
};

export const WithTooltipAndCustomValueTransformer: Story = {
    args: {
        showTooltip: true,
        transformValue: (value: number) => {
            return `${Math.round(value)}%`;
        }
    }
};

export const WithExternalValueControl: Story = {
    args: {
        value: 50,
        defaultValue: 50,
        showTooltip: true,
        transformValue: (value: number) => {
            return `${Math.round(value)}%`;
        }
    },
    render: args => {
        const [value, setValue] = useState(0);
        return (
            <div className={"w-full"}>
                <div>
                    <Slider {...args} value={value} onValueChange={value => setValue(value)} />
                </div>
                <div className={"mt-4 text-center"}>
                    <button onClick={() => setValue(0)}>{"Reset"}</button>
                </div>
                <div className={"mt-4 text-center"}>
                    Current value: <code>{value}</code>
                </div>
            </div>
        );
    }
};
