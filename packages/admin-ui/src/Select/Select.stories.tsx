import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";

const meta: Meta<typeof Select> = {
    title: "Components/Select",
    component: Select,
    tags: ["autodocs"],
    argTypes: {
        onValueChange: { action: "onValueChange" },
        onOpenChange: { action: "onOpenChange" }
    }
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
    args: {
        options: [
            "Eastern Standard Time (EST)",
            "Central Standard Time (CST)",
            "Pacific Standard Time (PST)",
            "Greenwich Mean Time (GMT)",
            "Central European Time (CET)",
            "Central Africa Time (CAT)",
            "India Standard Time (IST)",
            "China Standard Time (CST)",
            "Japan Standard Time (JST)",
            "Australian Western Standard Time (AWST)",
            "New Zealand Standard Time (NZST)",
            "Fiji Time (FJT)",
            "Argentina Time (ART)",
            "Bolivia Time (BOT)",
            "Brasilia Time (BRT)"
        ]
    }
};

export const PrimaryVariant: Story = {
    args: {
        ...Default.args,
        variant: "primary"
    }
};

export const SecondaryVariant: Story = {
    args: {
        ...Default.args,
        variant: "secondary"
    }
};

export const QuietVariant: Story = {
    args: {
        ...Default.args,
        variant: "quiet"
    }
};

export const MediumSize: Story = {
    args: {
        ...Default.args,
        size: "md"
    }
};

export const LargeSize: Story = {
    args: {
        ...Default.args,
        size: "lg"
    }
};

export const ExtraLargeSize: Story = {
    args: {
        ...Default.args,
        size: "xl"
    }
};

export const WithCustomPlaceholder: Story = {
    args: {
        placeholder: "Custom placeholder"
    }
};

export const Disabled: Story = {
    args: {
        disabled: true
    }
};

export const WithFormattedOptions: Story = {
    args: {
        options: [
            { label: "Eastern Standard Time (EST)", value: "est" },
            { label: "Central Standard Time (CST)", value: "cst" },
            { label: "Pacific Standard Time (PST)", value: "pst" },
            { label: "Greenwich Mean Time (GMT)", value: "gmt" },
            { label: "Central European Time (CET)", value: "cet" },
            { label: "Central Africa Time (CAT)", value: "cat" },
            { label: "India Standard Time (IST)", value: "ist" },
            { label: "China Standard Time (CST)", value: "cst_china" },
            { label: "Japan Standard Time (JST)", value: "jst" },
            { label: "Australian Western Standard Time (AWST)", value: "awst" },
            { label: "New Zealand Standard Time (NZST)", value: "nzst" },
            { label: "Fiji Time (FJT)", value: "fjt" },
            { label: "Argentina Time (ART)", value: "art" },
            { label: "Bolivia Time (BOT)", value: "bot" },
            { label: "Brasilia Time (BRT)", value: "brt" }
        ]
    }
};

export const WithOptionGroups: Story = {
    args: {
        options: [
            {
                label: "North America",
                options: [
                    { label: "Eastern Standard Time (EST)", value: "est" },
                    { label: "Central Standard Time (CST)", value: "cst" },
                    { label: "Pacific Standard Time (PST)", value: "pst" }
                ]
            },
            {
                label: "Europe & Africa",
                options: [
                    { label: "Greenwich Mean Time (GMT)", value: "gmt" },
                    { label: "Central European Time (CET)", value: "cet" },
                    { label: "Central Africa Time (CAT)", value: "cat" }
                ]
            },
            {
                label: "Asia",
                options: [
                    { label: "India Standard Time (IST)", value: "ist" },
                    { label: "China Standard Time (CST)", value: "cst_china" },
                    { label: "Japan Standard Time (JST)", value: "jst" }
                ]
            },
            {
                label: "Australia & Pacific",
                options: [
                    { label: "Australian Western Standard Time (AWST)", value: "awst" },
                    { label: "New Zealand Standard Time (NZST)", value: "nzst" },
                    { label: "Fiji Time (FJT)", value: "fjt" }
                ]
            },
            {
                label: "South America",
                options: [
                    { label: "Argentina Time (ART)", value: "art" },
                    { label: "Bolivia Time (BOT)", value: "bot" },
                    { label: "Brasilia Time (BRT)", value: "brt" }
                ]
            }
        ]
    }
};

export const WithSeparators: Story = {
    args: {
        options: [
            { label: "Eastern Standard Time (EST)", value: "est" },
            { label: "Central Standard Time (CST)", value: "cst" },
            { label: "Pacific Standard Time (PST)", value: "pst", separator: true },
            { label: "Greenwich Mean Time (GMT)", value: "gmt" },
            { label: "Central European Time (CET)", value: "cet" },
            { label: "Central Africa Time (CAT)", value: "cat", separator: true },
            { label: "India Standard Time (IST)", value: "ist" },
            { label: "China Standard Time (CST)", value: "cst_china" },
            { label: "Japan Standard Time (JST)", value: "jst", separator: true },
            { label: "Australian Western Standard Time (AWST)", value: "awst" },
            { label: "New Zealand Standard Time (NZST)", value: "nzst" },
            { label: "Fiji Time (FJT)", value: "fjt", separator: true },
            { label: "Argentina Time (ART)", value: "art" },
            { label: "Bolivia Time (BOT)", value: "bot" },
            { label: "Brasilia Time (BRT)", value: "brt" }
        ]
    }
};

export const WithDisabledOptions: Story = {
    args: {
        options: [
            { label: "Eastern Standard Time (EST)", value: "est", disabled: true },
            { label: "Central Standard Time (CST)", value: "cst", disabled: true },
            { label: "Pacific Standard Time (PST)", value: "pst", disabled: true },
            { label: "Greenwich Mean Time (GMT)", value: "gmt" },
            { label: "Central European Time (CET)", value: "cet" },
            { label: "Central Africa Time (CAT)", value: "cat" },
            { label: "India Standard Time (IST)", value: "ist" },
            { label: "China Standard Time (CST)", value: "cst_china" },
            { label: "Japan Standard Time (JST)", value: "jst" },
            { label: "Australian Western Standard Time (AWST)", value: "awst" },
            { label: "New Zealand Standard Time (NZST)", value: "nzst" },
            { label: "Fiji Time (FJT)", value: "fjt" },
            { label: "Argentina Time (ART)", value: "art" },
            { label: "Bolivia Time (BOT)", value: "bot" },
            { label: "Brasilia Time (BRT)", value: "brt" }
        ]
    }
};

export const WithExternalValueControl: Story = {
    args: {
        options: [
            "Eastern Standard Time (EST)",
            "Central Standard Time (CST)",
            "Pacific Standard Time (PST)",
            "Greenwich Mean Time (GMT)",
            "Central European Time (CET)",
            "Central Africa Time (CAT)",
            "India Standard Time (IST)",
            "China Standard Time (CST)",
            "Japan Standard Time (JST)",
            "Australian Western Standard Time (AWST)",
            "New Zealand Standard Time (NZST)",
            "Fiji Time (FJT)",
            "Argentina Time (ART)",
            "Bolivia Time (BOT)",
            "Brasilia Time (BRT)"
        ]
    },
    render: args => {
        const [value, setValue] = useState("");
        return (
            <div className={"w-full"}>
                <div>
                    <Select {...args} value={value} onValueChange={value => setValue(value)} />
                </div>
                <div className={"mt-4 text-center"}>
                    <button onClick={() => setValue("")}>{"Reset"}</button>
                </div>
                <div className={"mt-4 text-center"}>
                    Current selected value: <pre>{value}</pre>
                </div>
            </div>
        );
    }
};
