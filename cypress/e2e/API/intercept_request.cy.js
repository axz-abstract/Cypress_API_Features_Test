/// <reference types="cypress" />
describe('Interceptors, Stubs, Alias & Custom Commands', () => {  

  it('Should Intercept The User Search',() => {

    let user = "nobody"

    cy.intercept({
        method: "GET",
        url: `https://api.github.com/users/${user}`
    }).as('searchUser') 
    
    cy.visit('https://gh-users-search.netlify.app/')

    cy
      .get("[data-testid='search-bar']")
      .type(`${user}{enter}`)


    cy.wait('@searchUser', {requestTimeout:3000})
      .then( (intercepted) => {
        expect(intercepted.request.url).to.contain(user)
        expect(intercepted.response.statusCode).to.eq(200)
        let body = intercepted.response.body
        expect(body).to.have.property('name')
        expect(body).to.have.property('login',user)
        expect(body).to.have.property('repos_url')
        expect(body).to.have.property('followers')
        expect(body).to.have.property('following')
      })
      
  })

  it('Response With Empty Body',{defaultCommandTimeout:3000},() => {

    let user = "nobody"

    cy.intercept({
      method: "GET",
      url: `https://api.github.com/users/${user}`
    }, {
      body: {}
    }).as('searchUser') 
    
    cy.visit('https://gh-users-search.netlify.app/')

    cy
      .get("[data-testid='search-bar']")
      .type(`${user}{enter}`)

  })

  it('Force Network Error',() => {

    let user = "nobody"

    cy.intercept({
        method: "GET",
        url: `https://api.github.com/users/${user}/followers?per_page=100`
    }, {
      forceNetworkError: true
    }).as('getFollowers') 
    
    cy.visit('https://gh-users-search.netlify.app/')

    cy
      .get("[data-testid='search-bar']")
      .type(`${user}{enter}`)

    cy
      .wait('@getFollowers', {requestTimeout:8000})
      .then( (intercepted) => {
        expect(intercepted).to.have.property("state","Errored")
      })

  })

  it.only('Stub Response Of First Follower',() => {

    let user = "nobody"

    cy.intercept({
      method: "GET",
      url: `https://api.github.com/users/${user}/followers?per_page=100`
    }, (req) => {
      req.reply( (res)=> {
        res.body[0].avatar_url = "https://whatsondisneyplus.b-cdn.net/wp-content/uploads/2021/09/homer.png",
        res.body[0].html_url = "https://github.com/homer3000"
        res.body[0].login = "Homer Simpson"

        return res
      })
    }).as('getFollowers') 
    
    cy.visit('https://gh-users-search.netlify.app/')

    cy
      .get("[data-testid='search-bar']")
      .type(`${user}{enter}`)

    cy
      .wait('@getFollowers',{requestTimeout:8000})

  })

  it('Fixture',() => {

    let user = "nobody"

    cy.intercept({
        method: "GET",
        url: `https://api.github.com/users/${user}/followers?per_page=100`
    }, {
      fixture: 'fixtureName'
    }).as('getFollowers') 
    
    cy.visit('https://gh-users-search.netlify.app/')

    cy
      .get("[data-testid='search-bar']")
      .type(`${user}{enter}`)

  })
  
})