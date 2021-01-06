const fs = require("fs");
const path = require("path");
const { green } = require("chalk");
const crypto = require("crypto");

function random(length = 32) {
    return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString("hex")
        .slice(0, length);
}

const PROJECT_FOLDER = ".";

(async () => {
    console.log(`✍️  Writing environment config files...`);
    // Create root .env
    const rootEnvFilePath = path.resolve(PROJECT_FOLDER, ".env");
    const rootExampleEnvFilePath = path.resolve(PROJECT_FOLDER, "example.env");
    if (fs.existsSync(rootEnvFilePath)) {
        console.log(`⚠️  ${green(".env")} already exists, skipping.`);
    } else {
        fs.copyFileSync(rootExampleEnvFilePath, rootEnvFilePath);
        let content = fs.readFileSync(rootEnvFilePath).toString();
        content = content.replace("{REGION}", "us-east-1");
        content = content.replace("{PULUMI_CONFIG_PASSPHRASE}", random());
        fs.writeFileSync(rootEnvFilePath, content);
        console.log(`✅️ ${green(".env")} was created successfully!`);
    }
})();
