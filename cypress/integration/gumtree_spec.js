describe('UI Test - Gumtree search and validate results', () => {
    before(() => {
        // uses baseUrl from cypress.json to fetch the web url
        cy.visit('/')
    })

    it('should search for Sennheiser Headphones', () => {
        // type search criteria
        cy.enterSearchField('input[id="search-query"]', 'Sennheiser Headphones')

        // click category dropdown
        cy.clickDropdownorButton('div#categoryId-wrp')

        // select Electronics & Computer
        cy.selectOption('div#categoryId-wrpwrapper', 'Electronics & Computer')

        // enter location
        cy.enterSearchField('#search-area', 'Sydney Region, NSW')

        // click search radius dropdown
        cy.clickDropdownorButton('#srch-radius-wrp')

        // select 20Km
        cy.selectOption('div#srch-radius-wrpwrapper', '20km')

        // Search (or) submit the form
        cy.clickDropdownorButton('button[type="submit"]')

        // click on first search result
        cy.clickFirstSearchResult('div.user-ad-collection-new-design__wrapper--row>a')

        // validate Advertisement Id using regEx, that the id ends with a numeric
        cy.getAdvertisementId('span.breadcrumbs__summary')
            .should('match', /[0-9]*$/)

        // check if atleast one similar results are displayed in the UI
        cy.returnAllSimilarSearchResults('ul.slider__item-wrapper>li')
            .should('have.length.greaterThan', 0)
    })
})

describe('API Test - Gumtree endpoint', () => {
    it('returns search results via api', () => {
        const locationId = 3003435
        const endpoint = `https://ecg-api.gumtree.com.au/api/papi/ads/search?categoryId=0&categoryRedirected=1&includeTopAds=1&keyword=Table&locationId=${locationId}&page=1&size=20&sortType=DATE_DESCENDING`

        // generate GET request
        cy.request({
            url: endpoint,
            method: 'GET'
        })
            .then((response) => {
                // validate response headers
                expect(response.status).to.eq(200)
                expect(response.headers['content-type']).to.include('application/json')

                // validate some response body fields
                expect(response.body.adSearchOptions.locationId).to.equal(locationId)
                expect(response.body.ads.length).to.be.at.least(1)
                expect(response.body.ads[0].adType).to.equal('OFFERED')
                expect(response.body.ads[0].description.length).to.be.greaterThan(1)
                expect(response.body.ads[0].categoryId).to.not.be.null
                expect(response.body.ads[0].title).to.be.a('string')
                expect(response.body.ads[0].pictures).to.not.be.empty
                expect(response.body.ads[0].pictures[0][0]).to.have.keys(['size', 'pictureUrl'])

                response.body.ads.forEach((eachAdItem) => {
                    cy.log(eachAdItem)
                    expect(eachAdItem.price).to.have.any.keys('priceType')
                })
            })
    })
})
