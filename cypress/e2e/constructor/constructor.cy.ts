/// <reference types="cypress" />

import ingredients from '../../e2e/constructor/ingredients.json';

const testUrl = 'http://localhost:5050';

describe('Страница конструктора бургера', () => {
  describe('проверяем, что при клике в конструктор добавляется булка и начинка', () => {
    beforeEach(() => {
      // мок серверного запроса ингредиентов
      cy.intercept('GET', '**/ingredients', { body: ingredients }).as(
        'getIngredients'
      );
      // идём на главную страницу
      cy.visit(testUrl);
      // ждём, пока выполнится запрос ингредиентов
      cy.wait('@getIngredients');
    });

    it('Показывается прелоадер во время загрузки ингредиентов', () => {
      cy.visit(testUrl);
      cy.wait('@getIngredients');
      cy.get('main').should('contain', 'Соберите бургер');
      cy.get('h1').should('contain', 'Соберите бургер');
    });

    it('Добавление булки в конструктор', () => {
      const bun = ingredients.data.find((item) => item.type === 'bun');
      cy.get('.add-button-bun').first().click({ force: true });
      cy.get('.constructor-element_pos_top').should('contain', bun!.name);
      cy.get('.constructor-element_pos_bottom').should('contain', bun!.name);
    });

    it('Добавление начинки в конструктор', () => {
      const mainIng = ingredients.data.find((item) => item.type === 'main');
      cy.get('.add-button-main').first().click({ force: true });
      cy.get('.constructor-element__row').should('contain', mainIng!.name);
    });

    it('Добавление соуса в конструктор', () => {
      const sauce = ingredients.data.find((item) => item.type === 'sauce');
      cy.get('.add-button-sauce').first().click({ force: true });
      cy.get('.constructor-element__row').should('contain', sauce!.name);
    });
  });
});
