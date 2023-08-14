import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Input from './Input';

describe('Input: ', () => {
  it('renders the input components', () => {
    render(<Input data-testid="input-element" />);
    expect(screen.getByTestId('input-element')).toBeInTheDocument();
  });
});
