/// <reference types="cypress" />
describe('Users Suite', () => {
  const API_KEY = Cypress.env('API_KEY');

  it('Should Get All Users',{defaultCommandTimeout:7000},() => {
      if (!Cypress.env('API_KEY'))
          throw new Error("API key not defined!")

      let response =  cy.request({
          method: "GET",
          url: "/users"
      }).should('have.a.property','status',200)

  })

})