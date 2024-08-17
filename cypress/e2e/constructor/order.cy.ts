import ingredients from '../../e2e/constructor/ingredients.json';
import order from '../../e2e/constructor/order.json';
import user from '../../e2e/constructor/user.json';

const SELECTORS = {
  orderButton: '[data-test="order-button"]',
  orderModal: '[data-test="order-modal"]',
  orderNumber: '[data-test="order-number"]',
  modalCloseButton: '[data-test="modal-close-button"]'
};

const testUrl = 'http://localhost:5050';

describe('оформляем заказ', () => {
  beforeEach(() => {
    // Мок запроса данных пользователя
    cy.intercept('GET', '**/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: user.user
      }
    }).as('getUser');

    // Мок серверного запроса ингредиентов
    cy.intercept('GET', '**/ingredients', { body: ingredients }).as(
      'getIngredients'
    );

    // Мок серверного запроса создания заказа
    cy.intercept('POST', '**/orders', (req) => {
      req.reply({
        statusCode: 200,
        body: order
      });
    }).as('createOrder');

    // Устанавливаем токены перед каждым тестом
    cy.then(() => {
      window.localStorage.setItem('refreshToken', 'fake-refresh-token');
      cy.setCookie('accessToken', 'Bearer fake-access-token');
    });
    cy.visit(testUrl);
  });

  it('оформляем заказ', () => {
    cy.get('.add-button-bun').first().click({ force: true });
    cy.get('.add-button-main').first().click({ force: true });
    cy.get(SELECTORS.orderButton).first().click({ force: true });
    cy.get('#modals').find(SELECTORS.orderModal).should('exist');
    cy.get(SELECTORS.orderNumber).should('contain', order.order.number);
    cy.get('#modals').find(SELECTORS.modalCloseButton).click();
    cy.get('#modals').find(SELECTORS.orderModal).should('not.exist');
    cy.get('.constructor-element').should('not.exist');
  });
});
