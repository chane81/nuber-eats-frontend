import { render } from '../../utils/test-utils';
import { Button } from '../button';

describe('<Button />', () => {
  it('should render ok with props', () => {
    const { getByText } = render(
      <Button canClick={true} loading={false} actionText='test'></Button>,
    );

    getByText('test');
  });

  it('should display loading', () => {
    const { getByText, container } = render(
      <Button canClick={false} loading={true} actionText='test'></Button>,
    );

    getByText('Loading...');
    expect(container.firstChild).toHaveClass('bg-gray-300 pointer-events-none');
  });
});
