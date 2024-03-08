// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
  
      /**
       * Creates a new user through a POST request to the users endpoint
       *
       * @example
       * cy.newUser("email@test.com","Name","male","active")
       */
      newUser(email:string,name:string,gender:string,status:string)
    }
  }