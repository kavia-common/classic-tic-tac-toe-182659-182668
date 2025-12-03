import { render, screen } from '@testing-library/react';
import App from './App';

test('shows initial status as Next: X', () => {
  render(<App />);
  const status = screen.getByRole('status');
  expect(status).toHaveTextContent(/Next:\s*X/i);
});
