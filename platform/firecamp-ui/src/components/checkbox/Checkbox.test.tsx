import '@testing-library/jest-dom';
import {
  getByRole,
  queryByText,
  render,
  screen,
} from '@testing-library/react';
import { Checkbox } from '@firecamp/ui';
import { click } from '../../../__mocks__/eventMock';

describe('Checkbox: ', () => {
  it('render the checkbox component', () => {
    render(<Checkbox checked />);
    const CheckboxElement = screen.getByTestId('checkbox');
    expect(CheckboxElement).toBeInTheDocument();
    expect(CheckboxElement).toBeChecked();
  });
  it('should validate click event for the disabled state ', () => {
    const mockOnToggle = jest.fn();
    const { container } = render(
      <Checkbox disabled onToggleCheck={() => mockOnToggle()} />
    );
    click(container.firstElementChild as HTMLElement);
    expect(mockOnToggle).not.toHaveBeenCalled();
  });
  it('should render the onToggleCheck function', () => {
    const mockOnToggle = jest.fn();
    const { container } = render(
      <Checkbox onToggleCheck={() => mockOnToggle()} label="labelText" />
    );
    click(getByRole(container, 'checkbox'));
    expect(mockOnToggle).toHaveBeenCalled();
  });
  it('should update the visibility of label', () => {
    const { container, unmount } = render(
      <Checkbox showLabel label="labelText" />
    );
    expect(queryByText(container, 'labelText')).toBeInTheDocument();
    unmount();

    // should hide the label text visibility
    const { container: containerWithoutLabel } = render(
      <Checkbox showLabel={false} label="labelText" />
    );
    expect(queryByText(containerWithoutLabel, 'labelText')).toBeNull();
  });
});
