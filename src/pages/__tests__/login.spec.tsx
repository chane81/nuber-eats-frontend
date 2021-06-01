import { ApolloProvider } from '@apollo/client';
//import { createMockClient } from '@apollo/client/testing';
import { createMockClient } from 'mock-apollo-client';
import { render, waitFor } from '@testing-library/react';
import { Login } from '../login';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router } from 'react-router-dom';

describe('<Login />', () => {
  beforeEach(async () => {
    await waitFor(() => {
      const mockedClient = createMockClient();

      render(
        <HelmetProvider>
          <Router>
            <ApolloProvider client={mockedClient}>
              <Login />
            </ApolloProvider>
          </Router>
        </HelmetProvider>,
      );
    });
  });

  it('should render ok', async () => {
    await waitFor(() => {
      expect(document.title).toBe('Login | Nuber Eats');
    });
  });

  it('display email validation errors', async () => {});
});
