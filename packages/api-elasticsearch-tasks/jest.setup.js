const base = require("../../jest.config.base");
const presets = require("@webiny/project-utils/testing/presets")(
    ["@webiny/api-headless-cms", "storage-operations"],
    ["@webiny/api-form-builder", "storage-operations"],
    ["@webiny/api-page-builder", "storage-operations"],
    ["@webiny/api-i18n", "storage-operations"],
    ["@webiny/api-security", "storage-operations"],
    ["@webiny/api-tenancy", "storage-operations"]
);

module.exports = {
    ...base({ path: __dirname }, presets)
};
