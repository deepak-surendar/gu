describe('UI Test - Gumtree search and validate results', () => {
    before(() => {
        // uses baseUrl from cypress.json to fetch the web url
        cy.visit('/')
    })

    it('should search for Sennheiser Headphones', () => {
        // type search criteria
        cy.get('input[id="search-query"]').should('be.visible')
            .type('Sennheiser Headphones')

        // click category dropdown
        cy.get('div#categoryId-wrp').should('be.visible')
            .click()
        // select Electronics & Computer
        cy.get('div#categoryId-wrpwrapper').should('be.visible')
            .each(($selectBoxesElements) => {
                cy.wrap($selectBoxesElements).contains('Electronics & Computer')
                    .click()
            })
        // enter location
        cy.get('#search-area').should('be.visible')
            .type('Sydney Region, NSW')
        
        // click search radius dropdown
        cy.get('#srch-radius-wrp').should('be.visible')
            .click()
        // select 20Km
        cy.get('div#srch-radius-wrpwrapper').should('be.visible')
            .each(($radiusElements) => {
                cy.wrap($radiusElements).contains('20km')
                    .click()
            })

        // Search (or) submit the form
        cy.get('button[type="submit"]').should('be.visible')
            .click()

        // click on first search result
        cy.get('div.user-ad-collection-new-design__wrapper--row>a')
        .should('have.length.greaterThan', 0)
        .should('be.visible')
            .first().click()

        // validate Advertisement Id using regEx, that the id ends with a numeric
        cy.get('span.breadcrumbs__summary').should('be.visible')
            .invoke('text')
            .should('match', /[0-9]*$/)

        // check if atleast one similar results are displayed in the UI
        cy.get('ul.slider__item-wrapper>li').should('have.length.greaterThan', 0)
    })
})

describe('API Test - Gumtree endpoint', () => {
    it('returns search results via api', () => {
        // generate GET request
        cy.request({
         url: 'https://ecg-api.gumtree.com.au/api/papi/ads/search?categoryId=0&categoryRedirected=1&includeTopAds=1&keyword=Table&locationId=3003435&page=1&size=20&sortType=DATE_DESCENDING',
         method: 'GET'   
        })
        .then((response) => {
            // validate response headers
            expect(response.status).to.eq(200)    
            expect(response.headers['content-type']).to.include('application/json')
            
            // validate some response body fields
            expect(response.body.ads.length).to.be.at.least(1)
            expect(response.body.ads[0].adType).to.equal('OFFERED')
            expect(response.body.ads[0].description.length).to.be.greaterThan(1)
            expect(response.body.ads[0].categoryId).to.not.be.null
            expect(response.body.ads[0].title).to.be.a('string')
            expect(response.body.ads[0].pictures).to.not.be.empty
            expect(response.body.ads[0].pictures[0][0]).to.have.keys(['size', 'pictureUrl'])           
        })
    })
})