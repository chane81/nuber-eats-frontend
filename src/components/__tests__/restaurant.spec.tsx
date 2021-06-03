import { render } from '../../utils/test-utils';
import { BrowserRouter as Router } from 'react-router-dom';
import { Restaurant } from '../restaurant';

describe('<Restaurant />', () => {
  it('renders ok with props', () => {
    const restaurantProps = {
      id: '1',
      name: 'name',
      coverImg: 'cov',
      categoryName: 'catName',
    };

    const { debug, getByText, container } = render(
      <Router>
        <Restaurant {...restaurantProps} />,
      </Router>,
    );

    getByText('name');
    getByText('catName');
    expect(container.getElementsByClassName('bg-cover')[0]).toHaveAttribute(
      'style',
      'background-image: url(cov);',
    );
    expect(container.firstChild).toHaveAttribute('href', '/restaurant/1');
  });
});
