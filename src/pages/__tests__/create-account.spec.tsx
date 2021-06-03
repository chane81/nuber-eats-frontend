import { CreateAccount, CREATE_ACCOUNT_MUTATION } from '../create-account';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import { ApolloProvider } from '@apollo/client';
import { render, waitFor, RenderResult } from '../../utils/test-utils';
import userEvent from '@testing-library/user-event';
import { UserRole } from '../../__generated__/globalTypes';

const mockPush = jest.fn();

jest.mock('react-router-dom', () => {
  const realModule = jest.requireActual('react-router-dom');

  return {
    ...realModule,
    useHistory: () => ({
      push: mockPush,
    }),
  };
});

describe('<CreateAccount />', () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;

  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();

      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <CreateAccount />
        </ApolloProvider>,
      );
    });
  });

  it('renders ok', async () => {
    await waitFor(() =>
      expect(document.title).toBe('Create Account | Nuber Eats'),
    );
  });

  it('renders validation errors', async () => {
    const { getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const button = getByRole('button');
    const getErrorMsg = () => getByRole('alert');

    // 잘못된 이메일 형식 체크
    await waitFor(() => {
      userEvent.type(email, 'test@mail');
    });
    expect(getErrorMsg()).toHaveTextContent(/please enter a valid email/i);

    // 이메일 required 체크
    await waitFor(() => {
      userEvent.clear(email);
    });
    expect(getErrorMsg()).toHaveTextContent(/email is required/i);

    // 패스워드 required 체크
    await waitFor(() => {
      userEvent.type(email, 'my@email.com');
      userEvent.click(button);
    });
    expect(getErrorMsg()).toHaveTextContent(/password is required/i);
  });

  it('submits mutation with form values', async () => {
    const { debug, getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const button = getByRole('button');
    const formData = {
      email: 'test@mail.com',
      password: '1234',
      role: UserRole.Client,
    };

    const mockedCreateAccountMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: 'mutation-error',
        },
      },
    });

    // window alert spy 처리
    jest.spyOn(window, 'alert').mockImplementation(() => null);

    // create account mutation mock 처리
    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedCreateAccountMutationResponse,
    );

    // create account mutation 정상작동 체크
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(button);
    });

    expect(mockedCreateAccountMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedCreateAccountMutationResponse).toHaveBeenCalledWith({
      createAccountInput: {
        ...formData,
      },
    });
    expect(window.alert).toHaveBeenCalledWith('Account Created! Log in now!');

    // mutation error 체크
    const mutationError = getByRole('alert');
    expect(mutationError).toHaveTextContent('mutation-error');

    // history push 체크
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  // 모든 테스트가 끝난뒤 모든 mock 를 clear 처리
  afterAll(() => {
    jest.clearAllMocks();
  });
});
