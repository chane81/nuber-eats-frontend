import { UserRole } from '../../../src/__generated__/globalTypes';

describe('Create Account', () => {
  const user = cy;

  // 이메일 / 패스워드 입력 유효성 체크
  it('should see email / password validation errors', () => {
    user.visit('/');

    // create account 페이지로 이동
    user.findByText(/create an account/i).click();

    // 이메일 유효성 체크
    user.findByPlaceholderText(/email/i).type('fdfd@mail');
    user.findByRole('alert').should('have.text', 'Please enter a valid email');
    user.findByPlaceholderText(/email/i).clear();
    user.findByRole('alert').should('have.text', 'Email is required');

    // 패스워드 유효성 체크
    user.findByPlaceholderText(/email/i).type('test@mail.com');
    user
      .findByPlaceholderText(/password/i)
      .type('a')
      .clear();
    user.findByRole('alert').should('have.text', 'Password is required');
  });

  // 사용자 계정 생성 및 유효성 체크
  it('should be able to create account', () => {
    // graphql call 인터셉트
    user.intercept('http://localhost:4000/graphql', (req) => {
      const { operationName } = req.body;

      if (operationName && operationName === 'createAccountMutation') {
        req.reply((res) => {
          res.send({
            data: {
              createAccount: {
                ok: true,
                error: null,
                __typename: 'CreateAccountOutput',
              },
            },
          });
        });
      }
    });

    user.visit('/create-account');

    // 계정생성
    user.findByPlaceholderText(/email/i).type('client3@naver.com');
    user.findByPlaceholderText(/password/i).type('12345');
    user.findByRole('listbox').select(UserRole.Client);
    user.findByRole('button').click();

    user.wait(1000);

    // 로그인페이지 진입 확인
    user.title().should('eq', 'Login | Nuber Eats');

    // 계정생성 후 이동된 로그인페이지에서 로그인 되는지 체크
    user.findByPlaceholderText(/email/i).type('client3@naver.com');
    user.findByPlaceholderText(/password/i).type('12345');
    user.findByRole('button').click();
    user.window().its('localStorage.nuber-token').should('be.a', 'string');
  });
});
