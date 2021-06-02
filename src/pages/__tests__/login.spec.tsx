import { ApolloProvider } from '@apollo/client';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import { Login, LOGIN_MUTATION } from '../login';
import userEvent from '@testing-library/user-event';
import { loginMutation } from '../../__generated__/loginMutation';
import { render, waitFor, RenderResult } from '../../test-utils';

describe('<Login />', () => {
  let renderResult: RenderResult;
  let mockedClient: MockApolloClient;

  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();

      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <Login />
        </ApolloProvider>,
      );
    });
  });

  const loginMutationTest = async (
    formData: {
      email: string;
      password: string;
    },
    mutationResult: loginMutation,
  ) => {
    const { getByPlaceholderText, debug, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const submitBtn = getByRole('button');

    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        ...mutationResult,
      },
    });

    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);

    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });

    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      loginInput: {
        ...formData,
      },
    });

    return {
      emailCtrl: email,
      passwordCtrl: password,
      submitBtn,
      getByRole,
      debug,
      mockedMutationResponse,
    };
  };

  it('should render ok', async () => {
    await waitFor(() => {
      expect(document.title).toBe('Login | Nuber Eats');
    });
  });

  it('display email validation errors', async () => {
    const { getByPlaceholderText, debug, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);

    await waitFor(() => {
      userEvent.type(email, 'test@mail');
    });

    let errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent('Please enter a valid email');

    await waitFor(() => {
      userEvent.clear(email);
    });

    errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/email is required/i);
  });

  it('display password required errors', async () => {
    const { getByPlaceholderText, debug, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const submitBtn = getByRole('button');

    await waitFor(() => {
      userEvent.type(email, 'test@mail.com');
      userEvent.click(submitBtn);
    });

    const errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/password is required/i);
  });

  it('submit form and calls mutation', async () => {
    const formData = {
      email: 'test@test.com',
      password: '1234',
    };

    await loginMutationTest(formData, {
      login: {
        ok: true,
        token: '123ff',
        error: null,
        __typename: 'LoginOutput',
      },
    });
  });

  it('submit form and calls mutation error', async () => {
    const formData = {
      email: 'test@test.com',
      password: '1234',
    };

    const { getByRole } = await loginMutationTest(formData, {
      login: {
        ok: false,
        token: null,
        error: 'mutation error',
        __typename: 'LoginOutput',
      },
    });

    const errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/mutation error/i);
  });
});
