import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders scheduler selector app', () => {
  render(<App />);
  const navElement = screen.getByRole('navigation');
  expect(navElement).toBeInTheDocument();
});
