import { render } from '@testing-library/react';

import Signals from './trade';

describe('Signals', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Signals />);
    expect(baseElement).toBeTruthy();
  });
});
