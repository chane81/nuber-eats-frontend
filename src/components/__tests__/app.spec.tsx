import { render, waitFor } from '../../test-utils';
import { isLoggedInVar } from '../../apollo';
import { App } from '../app';

jest.mock('../../routers/logged-out-router', () => {
  return {
    LoggedOutRouter: () => <span>logged-out</span>,
  };
});

jest.mock('../../routers/logged-in-router', () => {
  return {
    LoggedInRouter: () => <span>logged-in</span>,
  };
});

describe('<App />', () => {
  it('renders LoggedOutRouter', () => {
    const { getByText } = render(<App />);

    getByText('logged-out');
  });

  it('renders LoggedInRouter', async () => {
    const { getByText } = render(<App />);

    // 상태값 update 시 사용
    await waitFor(() => {
      isLoggedInVar(true);
    });

    getByText('logged-in');
  });
});
