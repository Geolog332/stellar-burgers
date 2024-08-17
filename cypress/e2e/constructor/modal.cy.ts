/// <reference types="cypress" />

import ingredients from '../../e2e/constructor/ingredients.json';

const SELECTORS = {
  ingredient: '[data-test="ingredient"]',
  ingredientOpenModal: '[data-test="ingredient-open-modal"]',
  modalCloseButton: '[data-test="modal-close-button"]',
  modalCloseOverlay: '[data-test="modal-close-overlay"]'
};

const testUrl = 'http://localhost:5050';

describe('проверяем, что модальное окно с ингредиентом открывается и закрывается', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { body: ingredients }).as(
      'getIngredients'
    );
    cy.visit(testUrl);
    cy.wait('@getIngredients');
  });

  it('открываем модальное окно при клике на контейнер с ингредиентом и закрываем модальное окно при нажатии на кнопку закрытия', () => {
    cy.get(SELECTORS.ingredient).first().click();
    cy.get('#modals').find(SELECTORS.ingredientOpenModal).should('exist');
    cy.get('#modals').find(SELECTORS.modalCloseButton).click();
    cy.get('#modals').find(SELECTORS.ingredientOpenModal).should('not.exist');
  });

  it('закрываем модальное окно при клике на оверлей', () => {
    cy.get(SELECTORS.ingredient).first().click();
    cy.get('#modals').find(SELECTORS.ingredientOpenModal).should('exist');
    cy.get('#modals').find(SELECTORS.modalCloseOverlay).click({ force: true });
    cy.get('#modals').find(SELECTORS.ingredientOpenModal).should('not.exist');
  });

  it('закрываем модальное окно при нажатии на клавишу Escape', () => {
    cy.get(SELECTORS.ingredient).first().click();
    cy.get('#modals').find(SELECTORS.ingredientOpenModal).should('exist');
    cy.get('body').type('{esc}');
    cy.get('#modals').find(SELECTORS.ingredientOpenModal).should('not.exist');
  });
});
