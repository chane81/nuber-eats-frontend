import { render } from '../../utils/test-utils';
import { Category } from '../category';

describe('<Category />', () => {
  it('should render ok with props', () => {
    const { getByText, container } = render(
      <Category coverImg='img' name='catName' />,
    );

    getByText('catName');
    expect(container.querySelector('.bg-cover')).toHaveStyle(
      'backgroundImage: url(img)',
    );
  });
});
