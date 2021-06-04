describe('Edit Profile', () => {
  const user = cy;

  beforeEach(() => {
    user.login('client1@naver.com', '12345');
  });

  it('can go to /edit-profile using the header', () => {
    user.get('a[href="/edit-profile"').click();
    user.wait(2000);
    user.title().should('eq', 'Edit Profile | Nuber Eats');
  });

  it('can change email', () => {
    // graphql call 인터셉트
    user.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      console.log('req body', req.body);
      const { operationName } = req.body;

      if (operationName && operationName === 'editProfile') {
        // request 인터셉트
        req.body.variables.input.email = 'client1@naver.com';
      }
    });

    user.visit('/edit-profile');
    user.findByPlaceholderText(/email/i).clear().type('client1new@naver.com');
    user.findByPlaceholderText(/password/i).type('12345');
    user.findByText('Save Profile').click();
  });
});
