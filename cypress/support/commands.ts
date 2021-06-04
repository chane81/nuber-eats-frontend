//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//

/**
 * cypress 커스텀 커맨드 로직 작성
 */

// type 제공
declare global {
  namespace Cypress {
    interface Chainable {
      // 로그인 체크
      assertLoggedIn(): Chainable<string>;
    }
  }
}

import '@testing-library/cypress/add-commands';

// 로그인 체크
Cypress.Commands.add('assertLoggedIn', () => {
  cy.window().its('localStorage.nuber-token').should('be.a', 'string');
});
