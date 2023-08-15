import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Menu } from 'lucide-react';
import Button from './Button';

describe('Button : ', () => {
  it('renders the button', () => {
    render(<Button text="Primary Button" />);
    expect(screen.getByText('Primary Button')).toBeInTheDocument();
  });

  it('renders button with icon only', () => {
    render(<Button leftIcon={<Menu size={10} data-testid={'menu-icon'} />} />);
    const leftIcon = screen.getByTestId('menu-icon').closest('span');
    expect(leftIcon).toHaveClass('mr-0');
  });

  it('renders fullwidth button text with center alignment', () => {
    render(
      <Button
        fullWidth
        text="Full width button"
        data-testid={'button-element'}
        leftIcon={undefined}
      />
    );
    const button = screen.getByTestId('button-element');

    expect(button).toHaveClass('justify-center');
  });
});
