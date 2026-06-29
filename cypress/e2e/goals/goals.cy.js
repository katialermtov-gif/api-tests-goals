/// <reference types="cypress" />
const { faker } = require("@faker-js/faker");

const AUTH_HEADER = {
  Authorization: "pk_302443215_UBA3N9JV7WG7U3CCYWUWTBMYFGQP2E79",
};

const BASE_URL = "https://api.clickup.com/api/v2";
const TEAM_ID = "90121755543";
const OWNER_ID = 302443215;

const createdGoalIds = [];
let createdGoalId;
let goalName;
let updatedGoalName;

describe("Tests for goals api for Clickup", () => {
  after(() => {
    createdGoalIds.forEach((goalId) => {
      cy.request({
        method: "DELETE",
        url: `${BASE_URL}/goal/${goalId}`,
        headers: AUTH_HEADER,
        failOnStatusCode: false,
      }).then((response) => {
        cy.log(`Cleanup delete goal ${goalId}, status: ${response.status}`);
      });
    });
  });

  // POST request — create goal
  it("sent Post request to create goal returns 200", () => {
    goalName = `Goal ${faker.person.firstName()}`;
    const dueDate = Date.now() + 30 * 24 * 60 * 60 * 1000;

    cy.log(`Creating goal: ${goalName}`);

    cy.request({
      method: "POST",
      url: `${BASE_URL}/team/${TEAM_ID}/goal`,
      headers: AUTH_HEADER,
      body: {
        name: goalName,
        due_date: dueDate,
        description: "Goal created by Cypress test",
        multiple_owners: true,
        owners: [OWNER_ID],
        color: "#32a852",
      },
      failOnStatusCode: false,
    }).then((response) => {
      cy.log(`Status: ${response.status}`);
      cy.log(`Body: ${JSON.stringify(response.body)}`);

      expect(response.status).to.eq(200);
      expect(response.body.goal).to.exist;
      expect(response.body.goal.name).to.eq(goalName);

      createdGoalId = response.body.goal.id;
      createdGoalIds.push(createdGoalId);
    });
  });

  // GET request — list team goals
  it("sent get request to team goals returns 200 and contains created goal", () => {
    cy.request({
      method: "GET",
      url: `${BASE_URL}/team/${TEAM_ID}/goal`,
      headers: AUTH_HEADER,
      failOnStatusCode: false,
    }).then((response) => {
      cy.log(`Status: ${response.status}`);
      cy.log(`Body: ${JSON.stringify(response.body)}`);

      expect(response.status).to.eq(200);
      expect(response.body.goals).to.be.an("array");

      const goal = response.body.goals.find((item) => item.id === createdGoalId);
      expect(goal, "created goal should exist in team goals list").to.exist;
      expect(goal.name).to.eq(goalName);
    });
  });

  // GET request — get goal by id
  it("sent get request to goal by id returns 200", () => {
    cy.request({
      method: "GET",
      url: `${BASE_URL}/goal/${createdGoalId}`,
      headers: AUTH_HEADER,
      failOnStatusCode: false,
    }).then((response) => {
      cy.log(`Status: ${response.status}`);
      cy.log(`Body: ${JSON.stringify(response.body)}`);

      expect(response.status).to.eq(200);
      expect(response.body.goal.id).to.eq(createdGoalId);
      expect(response.body.goal.name).to.eq(goalName);
      expect(response.body.goal.description).to.eq("Goal created by Cypress test");
    });
  });

  // PUT request — update goal
  it("sent Put request to update goal returns 200", () => {
    updatedGoalName = `Updated ${faker.person.firstName()}`;
    const updatedDueDate = Date.now() + 60 * 24 * 60 * 60 * 1000;

    cy.request({
      method: "PUT",
      url: `${BASE_URL}/goal/${createdGoalId}`,
      headers: AUTH_HEADER,
      body: {
        name: updatedGoalName,
        due_date: updatedDueDate,
        description: "Goal updated by Cypress test",
        color: "#4B8BF5",
        add_owners: [],
        rem_owners: [],
      },
      failOnStatusCode: false,
    }).then((response) => {
      cy.log(`Updated name: ${updatedGoalName}`);
      cy.log(`Status: ${response.status}`);
      cy.log(`Body: ${JSON.stringify(response.body)}`);

      expect(response.status).to.eq(200);
      expect(response.body.goal.name).to.eq(updatedGoalName);
      expect(response.body.goal.description).to.eq("Goal updated by Cypress test");
    });
  });

  // DELETE request — delete goal
  it("sent Delete request to goal returns 200", () => {
    cy.request({
      method: "DELETE",
      url: `${BASE_URL}/goal/${createdGoalId}`,
      headers: AUTH_HEADER,
      failOnStatusCode: false,
    }).then((deleteResponse) => {
      cy.log(`Delete status: ${deleteResponse.status}`);
      expect(deleteResponse.status).to.eq(200);

      const index = createdGoalIds.indexOf(createdGoalId);
      if (index !== -1) {
        createdGoalIds.splice(index, 1);
      }
    });
  });
});
