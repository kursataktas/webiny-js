import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ReactComponent as NotificationsIcon } from "@material-design-icons/svg/outlined/notifications.svg";
import { ReactComponent as CalendarIcon } from "@material-design-icons/svg/outlined/calendar_month.svg";

import { Input } from "./Input";
import { Icon } from "~/Icon";

const meta: Meta<typeof Input> = {
    title: "Components/Input",
    component: Input,
    tags: ["autodocs"],
    argTypes: {
        onChange: { action: "onChange" },
        type: {
            control: "select",
            options: [
                "text",
                "number",
                "email",
                "password",
                "tel",
                "url",
                "search",
                "date",
                "datetime-local",
                "month",
                "week",
                "time",
                "color",
                "file",
                "checkbox",
                "radio",
                "range",
                "hidden",
                "button",
                "submit",
                "reset",
                "image"
            ],
            defaultValue: "text"
        }
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
        placeholder: "Custom placeholder",
        size: "md"
    }
};

export const LargeSize: Story = {
    args: {
        placeholder: "Custom placeholder",
        size: "lg"
    }
};

export const ExtraLargeSize: Story = {
    args: {
        placeholder: "Custom placeholder",
        size: "xl"
    }
};

export const WithLeadingIcon: Story = {
    args: {
        placeholder: "Custom placeholder",
        leadingIcon: <Icon label={"Bell"} icon={<NotificationsIcon />} />
    }
};

export const WithTrailingIcon: Story = {
    args: {
        placeholder: "Custom placeholder",
        trailingIcon: <Icon label={"Calendar"} icon={<CalendarIcon />} />
    }
};

export const WithLeadingAndTrailingIcons: Story = {
    args: {
        placeholder: "Custom placeholder",
        leadingIcon: <Icon label={"Bell"} icon={<NotificationsIcon />} />,
        trailingIcon: <Icon label={"Calendar"} icon={<CalendarIcon />} />
    }
};

export const PrimaryVariant: Story = {
    args: {
        variant: "primary",
        placeholder: "Custom placeholder"
    }
};

export const PrimaryVariantDisabled: Story = {
    args: {
        ...PrimaryVariant.args,
        disabled: true
    }
};

export const PrimaryVariantInvalid: Story = {
    args: {
        ...PrimaryVariant.args,
        invalid: true
    }
};

export const SecondaryVariant: Story = {
    args: {
        variant: "secondary",
        placeholder: "Custom placeholder"
    }
};

export const SecondaryVariantDisabled: Story = {
    args: {
        ...SecondaryVariant.args,
        disabled: true
    }
};

export const SecondaryVariantInvalid: Story = {
    args: {
        ...SecondaryVariant.args,
        invalid: true
    }
};

export const GhostVariant: Story = {
    args: {
        variant: "ghost",
        placeholder: "Custom placeholder"
    }
};

export const GhostVariantDisabled: Story = {
    args: {
        ...GhostVariant.args,
        disabled: true
    }
};

export const GhostVariantInvalid: Story = {
    args: {
        ...GhostVariant.args,
        invalid: true
    }
};
