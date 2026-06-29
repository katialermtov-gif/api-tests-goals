Cypress.Commands.add("printMessage", () => {
  cy.log("hello word");
});

Cypress.Commands.add("sentRequest", (type, endpoint, body) => {
  cy.request({
    method: type,
    url: endpoint,
    body,
    headers: {
      Authorization: Cypress.env("clickupToken"),
    },
    failOnStatusCode: false,
  });
});
