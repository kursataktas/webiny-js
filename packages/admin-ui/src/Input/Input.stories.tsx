import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";
import React from "react";

const meta: Meta<typeof Input> = {
    title: "Components/Input",
    component: Input,
    tags: ["autodocs"],
    argTypes: {
        onChange: { action: "onChange" }
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
type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const MediumSize: Story = {
    args: {
        size: "md"
    }
};

export const LargeSize: Story = {
    args: {
        size: "lg"
    }
};

export const ExtraLargeSize: Story = {
    args: {
        size: "xl"
    }
};

export const WithPlaceholder: Story = {
    args: {
        placeholder: "Placeholder"
    }
};

export const Disabled: Story = {
    args: {
        disabled: true
    }
};

export const PrimaryVariant: Story = {
    args: {
        variant: "primary",
        placeholder: "Placeholder"
    }
};

export const PrimaryVariantDisabled: Story = {
    args: {
        ...PrimaryVariant.args,
        disabled: true
    }
};

export const SecondaryVariant: Story = {
    args: {
        variant: "secondary",
        placeholder: "Placeholder"
    }
};

export const SecondaryVariantDisabled: Story = {
    args: {
        ...SecondaryVariant.args,
        disabled: true
    }
};
