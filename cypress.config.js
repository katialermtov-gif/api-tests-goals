const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");

function loadLocalEnv() {
  const envPath = path.join(__dirname, "cypress.env.json");

  if (!fs.existsSync(envPath)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(envPath, "utf8"));
}

const localEnv = loadLocalEnv();

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return config;
    },
    baseUrl: "https://api.clickup.com/api/v2",
  },
  env: {
    clickupToken: process.env.CLICKUP_TOKEN || localEnv.clickupToken,
    clickupTeamId: process.env.CLICKUP_TEAM_ID || localEnv.clickupTeamId || "90121755543",
    clickupOwnerId: Number(
      process.env.CLICKUP_OWNER_ID || localEnv.clickupOwnerId || "302443215"
    ),
    clickupFolderId: process.env.CLICKUP_FOLDER_ID || localEnv.clickupFolderId || "901211410938",
    clickupExistingListId:
      process.env.CLICKUP_EXISTING_LIST_ID ||
      localEnv.clickupExistingListId ||
      "901218803752",
    clickupBaseUrl: localEnv.clickupBaseUrl || "https://api.clickup.com/api/v2",
  },
});
