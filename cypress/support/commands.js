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
//
Cypress.Commands.add('enterSearchField', (htmlElement, searchCriteria) => {
    cy.get(htmlElement).should('be.visible')
    .type(searchCriteria)
})

Cypress.Commands.add('clickDropdown', (htmlElement) => {
    cy.get(htmlElement).should('be.visible')
            .click()
})

Cypress.Commands.add('selectOption', (htmlElement, optionValue) => {
    cy.get(htmlElement).should('be.visible')
    .each(($selectBoxesElements) => {
        cy.wrap($selectBoxesElements).contains(optionValue)
            .click()
    })
})

Cypress.Commands.add('search', (htmlElement) => {
    cy.get(htmlElement).should('be.visible')
            .click()
})



