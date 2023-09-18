import { Switch } from '@firecamp/ui';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { click } from '../../../__mocks__/eventMock';

describe('Switch: ', () => {
  it('renders component', () => {
    render(<Switch checked={true} onToggleCheck={() => {}} />);
    expect(screen.getByTestId('switch')).toBeInTheDocument();
  });

  it('should render the onToggleCheck function', () => {
    const mockOnToggle = jest.fn();
    render(<Switch onToggleCheck={() => mockOnToggle()} label="labelText" />);
    click(screen.getByTestId('switch'));
    expect(mockOnToggle).toHaveBeenCalled();
  });
});
