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
      // 로그인 토큰 체크
      assertLoggedIn(): Chainable<string>;

      // 로그아웃 체크
      assertLoggedOut(): Chainable<string>;

      // 로그인
      login(email: string, password: string): void;
    }
  }
}

import '@testing-library/cypress/add-commands';

// 로그인 토큰 체크
Cypress.Commands.add('assertLoggedIn', () => {
  cy.window().its('localStorage.nuber-token').should('be.a', 'string');
});

// 로그아웃 상태를 토큰으로 체크
Cypress.Commands.add('assertLoggedOut', () => {
  cy.window().its('localStorage.nuber-token').should('be.undefined');
});

// 로그인
Cypress.Commands.add('login', (email, password) => {
  // visit
  cy.visit('/');

  // 로그아웃 상태 체크
  cy.assertLoggedOut();

  // 로그인페이지 진입 확인
  cy.title().should('eq', 'Login | Nuber Eats');

  // 이메일/패스워드 입력
  cy.findByPlaceholderText(/email/i).type(email);
  cy.findByPlaceholderText(/password/i).type(password);

  // 버튼의 pointer-events-none class 가 없는지 체크 후 click 발생
  cy.findByRole('button').should('not.have.class', 'pointer-events-none').click();

  // local storage 에 토큰있는지 체크
  cy.assertLoggedIn();
});
