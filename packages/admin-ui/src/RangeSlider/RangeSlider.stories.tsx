import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RangeSlider } from "./RangeSlider";

const meta: Meta<typeof RangeSlider> = {
    title: "Components/RangeSlider",
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

export const Default: Story = {};

export const WithDefaultValues: Story = {
    args: {
        defaultValue: [25, 75]
    }
};

export const WithMinAndMaxValues: Story = {
    args: {
        min: 25,
        max: 75
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
        defaultValue: [25, 75]
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
        transformValues: (value: number) => {
            return `${Math.round(value)}%`;
        }
    }
};
