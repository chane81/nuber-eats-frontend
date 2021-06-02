import { render } from '@testing-library/react';
import { Category } from '../category';

describe('<Category />', () => {
  it('should render ok with props', () => {
    const { getByText, container, debug } = render(
      <Category coverImg='img' name='catName' />,
    );

    getByText('catName');
    expect(container.querySelector('.bg-cover')).toHaveStyle(
      'backgroundImage: url(img)',
    );
    debug();
  });
});
