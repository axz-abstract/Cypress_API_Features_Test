/// <reference types="cypress" />
describe('Users Suite', () => {
  const API_KEY = Cypress.env('API_KEY');
  const new_user_data = {
      "email": "TeddySmith@mail.test",
      "gender": "male",
      "name": "Teddy Smith",
      "status": "active"
  };

  it('Should Get All Users',{defaultCommandTimeout:3000},() => {
      if (!Cypress.env('API_KEY'))
          throw new Error("API key not defined!")

      cy.request({
          method: "GET",
          url: "/users"
      }).then( (res) => {
          // expect keyword
          expect(res.status).to.eq(200)
          expect(res.body).to.be.an('array').and.to.have.lengthOf(10)
          expect(res.headers).to.have.property("content-type").and.to.contain("application/json")
          // should keyword
          cy.wrap(res.status).should('eq',200)
          cy.wrap(res.body).should('be.an','array').and('have.length',10)
          cy.wrap(res.headers).should('have.property','content-type').and('contain',"application/json")
      })
  })

  it('Should Create a New User', () => {
      
      cy.request({
          method: 'POST',
          url: '/users',
          headers: {
            'Authorization': `Bearer ${API_KEY}`
          },
          body: new_user_data
        }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property('id')
          expect(response.body.email).to.equal(new_user_data.email)
          expect(response.body.name).to.equal(new_user_data.name)
          expect(response.body.gender).to.equal(new_user_data.gender)
          expect(response.body.status).to.equal(new_user_data.status)
          Cypress.env('user_id',response.body.id)
        });

  })

  it('Should Get the New User', () => {

      cy.request({
          method: 'GET',
          url: `/users/${Cypress.env('user_id')}`,
          headers: {
            'Authorization': `Bearer ${API_KEY}`
          }
      }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.id).to.equal(Cypress.env('user_id'))
          expect(response.body.email).to.equal(new_user_data.email)
          expect(response.body.name).to.equal(new_user_data.name)
          expect(response.body.gender).to.equal(new_user_data.gender)
          expect(response.body.status).to.equal(new_user_data.status)
      });

  })

  it ('Should Update the New User Data', () => {
      cy.request({
          method: 'PATCH',
          url: `/users/${Cypress.env('user_id')}`,
          headers: {
            'Authorization': `Bearer ${API_KEY}`
          },
          body: {
              "email": "UPDATED_EMAIL@mail.test",
              "name": "UPDATED NAME"
          }
      }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.id).to.equal(Cypress.env('user_id'))
          expect(response.body.email).to.equal("UPDATED_EMAIL@mail.test")
          expect(response.body.name).to.equal("UPDATED NAME")
      });
  })

  it ('Should Delete the New User and check that there is no object found when that user is requested', () => {
      cy.request({
          method: 'DELETE',
          url: `/users/${Cypress.env('user_id')}`,
          headers: {
            'Authorization': `Bearer ${API_KEY}`
          }
      }).then((response) => {
          expect(response.status).to.eq(204)
          cy.request({
            method: 'GET',
            url: `/users/${Cypress.env('user_id')}`,
            headers: {
              'Authorization': `Bearer ${API_KEY}`
            },
            "failOnStatusCode": false
            }).then((response) => {
                expect(response.status).to.eq(404)
                expect(response.body.message).to.equal("Resource not found")
            });
      })
  })  
})