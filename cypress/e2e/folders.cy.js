/// <reference types="cypress" />
const { faker } = require('@faker-js/faker');

const AUTH_HEADER = {
  Authorization: "pk_302443215_165TQHSI0882JAP2EDEYNFMW68UQ3EVK",
};

const FOLDER_ID = "901211410938";
const EXISTING_LIST_ID = "901218803752";

const createdListIds = [];

describe("Tests for folder api for Clickup", () => {


  // GET request
  it("sent get request to folders returns 200", () => {
    cy.request({
      method: "GET",
      url: `https://api.clickup.com/api/v2/list/${EXISTING_LIST_ID}`,
      headers: AUTH_HEADER,
    }).then((response) => {
      cy.log(`Status: ${response.status}`);
      cy.log(`Body: ${JSON.stringify(response.body)}`);

      expect(response.status).to.eq(200);
    });
  });

  // POST request
  it("sent Post request to folders with valid name returns 200", () => {
    const listName = faker.person.firstName();

    cy.log(`Creating list: ${listName}`);

    cy.request({
      method: "POST",
      url: `https://api.clickup.com/api/v2/folder/${FOLDER_ID}/list`,
      headers: AUTH_HEADER,
      body: { name: listName },
      failOnStatusCode: false,
    }).then((response) => {
      cy.log(`Status: ${response.status}`);
      cy.log(`Body: ${JSON.stringify(response.body)}`);

      expect(response.status).to.eq(200);
      createdListIds.push(response.body.id);
    });
  });

  // PUT request
  it("sent Put request to folders with valid name returns 200", () => {
    const updatedName = faker.person.firstName();
    const listId = createdListIds[createdListIds.length - 1];

    cy.request({
      method: "PUT",
      url: `https://api.clickup.com/api/v2/list/${listId}`,
      headers: AUTH_HEADER,
      body: { name: updatedName },
      failOnStatusCode: false,
    }).then((response) => {
      cy.log(`Updated name: ${updatedName}`);
      cy.log(`Status: ${response.status}`);
      cy.log(`Body: ${JSON.stringify(response.body)}`);

      expect(response.status).to.eq(200);
    });
  });

  // DELETE request
  it("sent Delete request to folders returns 200", () => {
    const listId = createdListIds[createdListIds.length - 1];

    cy.request({
      method: "DELETE",
      url: `https://api.clickup.com/api/v2/list/${listId}`,
      headers: AUTH_HEADER,
      failOnStatusCode: false,
    }).then((deleteResponse) => {
      cy.log(`Delete status: ${deleteResponse.status}`);
      expect(deleteResponse.status).to.eq(200);

      const index = createdListIds.indexOf(listId);
      if (index !== -1) {
        createdListIds.splice(index, 1);
      }
    });
  });
});
