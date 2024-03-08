/// <reference types="cypress" />
describe('Users Suite', () => {
  const API_KEY = Cypress.env('API_KEY');

  it('Should Get All Users',{defaultCommandTimeout:3000},() => {
      if (!Cypress.env('API_KEY'))
          throw new Error("API key not defined!")

      cy.request({
          method: "GET",
          url: "/users"
      }).should( (res) => {
          // expect keyword
          expect(res.status).to.eq(200)
          expect(res.body).to.be.an('array').and.to.have.lengthOf(10)
          expect(res.headers).to.have.property("content-type").and.to.contain("application/json")
          // should keyword
        //   cy.wrap(res.status).should('eq',200)
        //   cy.wrap(res.body).should('be.an','array').and('have.length',10)
        //   cy.wrap(res.headers).should('have.property','content-type').and('contain',"application/json")
      })
  })

})