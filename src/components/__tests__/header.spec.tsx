import { render, waitFor } from '../../utils/test-utils';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter as Router } from 'react-router-dom';
import { Header } from '../header';
import { ME_QUERY } from '../../hooks/useMe';

describe('<Header />', () => {
  it('renders ok', async () => {
    await waitFor(async () => {
      const { queryByText } = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: 1,
                    email: '',
                    role: '',
                    verified: true,
                  },
                },
              },
            },
          ]}
        >
          <Router>
            <Header />
          </Router>
        </MockedProvider>,
      );

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(queryByText('Prease verify your email.')).toBeNull();
    });
  });

  it('renders without verify banner', async () => {
    await waitFor(async () => {
      const { getByText } = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: 1,
                    email: '',
                    role: '',
                    verified: false,
                  },
                },
              },
            },
          ]}
        >
          <Router>
            <Header />
          </Router>
        </MockedProvider>,
      );

      await new Promise((resolve) => setTimeout(resolve, 500));
      getByText('Prease verify your email.');
    });
  });
});
