import { NotFound } from '../404';
import { render, waitFor } from '../../utils/test-utils';

describe('<NotFound />', () => {
  it('renders ok', async () => {
    render(<NotFound />);

    /**
     * document.title 를 expect 를 바로 해주면 fail이 일어난다.
     * 이유는 Helmet 가 바로 title 를 바꿔주지 않기 때문이다.
     * 해서 waitFor 를 주어서 테스틀 실행한다.
     */
    await waitFor(() => {
      expect(document.title).toBe('Not Found | Nuber Eats');
    });
  });
});
