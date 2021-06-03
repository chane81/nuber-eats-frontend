import { CreateAccount } from '../create-account';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import { ApolloProvider } from '@apollo/client';
import { render, waitFor, RenderResult } from '../../utils/test-utils';

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
});
