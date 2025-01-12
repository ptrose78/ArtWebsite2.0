import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // For matchers like toBeInTheDocument
import Button from './Button';

test('renders the Button component', () => {
  render(<Button>Click Me</Button>);
  const button = screen.getByText(/click me/i);
  expect(button).toBeInTheDocument();
});
