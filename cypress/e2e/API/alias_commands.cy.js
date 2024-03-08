describe('Interceptors, Stubs, Alias & Custom Commands', () => {  

    beforeEach(() => {
        cy.request({
            method: "GET",
            url: "/users",
            headers: {
                'Authorization': 'Bearer ' + Cypress.env('API_KEY')
            }
        }).as("getUsersList")
    })

    it("Should Retrieve Users Through A Request With Alias",()=> {
        
        cy.get('@getUsersList').should( (response) => {
            expect(response).to.have.property('status',200)
            expect(response.body).to.be.an('array').and.to.have.lengthOf(10)
            for (let i=0;i<response.body.length;i++)
                expect(response.body[i]).to.have.property('id')
        })

    })

    it("Should Create a User with Custom Commands",()=> {
        
        cy.newUser("User_1@test.com","RandomName","female","active")
            .then( (response) => {
                cy.log(response)
                expect(response.body.email).to.equal("User_1@test.com")
                expect(response.body.name).to.equal("RandomName")
            })
        
    })

})