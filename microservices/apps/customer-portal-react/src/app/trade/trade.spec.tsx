import { render } from '@testing-library/react';

import { Trades } from './trade';

describe('Trades', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Trades />);
    expect(baseElement).toBeTruthy();
  });
});
