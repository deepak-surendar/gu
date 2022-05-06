// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
// Custom command to enter string in search box
Cypress.Commands.add('enterSearchField', (htmlElement, searchCriteria) => {
    cy.get(htmlElement).should('be.visible')
        .type(searchCriteria)
})

// Custom command to click on dropdown or a button
Cypress.Commands.add('clickDropdownorButton', (htmlElement) => {
    cy.get(htmlElement).should('be.visible')
        .click()
})

// Custom command to select an option from a dropdown
Cypress.Commands.add('selectOption', (htmlElement, optionValue) => {
    cy.get(htmlElement).should('be.visible')
        .each(($selectBoxesElements) => {
            cy.wrap($selectBoxesElements).contains(optionValue)
                .click()
        })
})

// Custom command to click on First Search Result
Cypress.Commands.add('clickFirstSearchResult', (htmlElement) => {
    cy.get(htmlElement)
        .should('have.length.greaterThan', 0)
        .should('be.visible')
        .first().click()
})

// Custom command to retreive AdvertisementId from search results
Cypress.Commands.add('getAdvertisementId', (htmlElement) => {
    return cy.get(htmlElement).should('be.visible')
        .invoke('text')
})

// Custom command to retreive an HTML element, in this case Similar search results
Cypress.Commands.add('returnAllSimilarSearchResults', (htmlElement) => {
    return cy.get(htmlElement)
})