import { render } from '@testing-library/react';
import { ProfitCalendar } from './profit-calendar';
describe('ProfitCalendar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProfitCalendar />);
    expect(baseElement).toBeTruthy();
  });
});
