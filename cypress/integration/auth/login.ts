describe('Login In', () => {
  const user = cy;

  // login page title 체크
  it('should see login page', () => {
    user.visit('/').title().should('eq', 'Login | Nuber Eats');
  });

  // 이메일 / 패스워드 유효 체크
  it('can see email / password validation errors', () => {
    user.visit('/');

    // 이메일 형식 체크
    user.findByPlaceholderText(/email/i).type('chane@mail');
    user.findByRole('alert').should('have.text', 'Please enter a valid email');

    // 이메일 clear
    user.findByPlaceholderText(/email/i).clear();

    // 이메일 필수입력 체크
    user.findByRole('alert').should('have.text', 'Email is required');

    // 패스워드 필수입력 체크
    user.findByPlaceholderText(/email/i).type('chane@mail.com');
    user
      .findByPlaceholderText(/password/i)
      .click()
      .type('a')
      .clear();
    user.findByRole('alert').should('have.text', 'Password is required');
  });

  // 로그인 체크
  it('can fill out the form and login', () => {
    user.visit('/');

    // 이메일/패스워드 입력
    user.findByPlaceholderText(/email/i).type('client8@naver.com');
    user.findByPlaceholderText(/password/i).type('12345');

    // 버튼의 pointer-events-none class 가 없는지 체크 후 click 발생
    user
      .findByRole('button')
      .should('not.have.class', 'pointer-events-none')
      .click();

    // local storage 에 토큰있는지 체크
    user.assertLoggedIn();
  });
});
