const authHeader = () => ({
  Authorization: Cypress.env("clickupToken"),
});

const baseUrl = () => Cypress.env("clickupBaseUrl");

const assertClickupToken = () => {
  expect(
    Cypress.env("clickupToken"),
    "Set CLICKUP_TOKEN in CI secrets or create cypress.env.json locally"
  ).to.be.a("string").and.not.be.empty;
};

module.exports = {
  authHeader,
  baseUrl,
  assertClickupToken,
};
