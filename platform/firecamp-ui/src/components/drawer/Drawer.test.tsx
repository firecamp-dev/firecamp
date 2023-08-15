import '@testing-library/jest-dom';
import { screen, render, fireEvent } from '@testing-library/react';
import Drawer from './Drawer';
import ResizeObserver from '../../../__mocks__/ResizeObserver';

window.ResizeObserver = ResizeObserver;

describe('Drawer: ', () => {
  it('renders drawer component', () => {
    render(
      <Drawer opened={true} onClose={() => {}} title="Drawer Title">
        Drawer Container
      </Drawer>
    );
    expect(screen.getByText('Drawer Container')).toBeInTheDocument();
  });

  it('should not renders drawer component', () => {
    render(
      <Drawer opened={false} onClose={() => {}} title="Drawer Title">
        Drawer Container
      </Drawer>
    );
    expect(screen.queryByText('Drawer Container')).toBeFalsy();
  });

  it('renders custom styles', () => {
    render(<Drawer opened onClose={() => {}} />);

    const contentElement = screen.queryByRole('dialog');
    expect(contentElement).toHaveClass('invisible-scrollbar');
  });

  it('calls onClose when drawer is closed', () => {
    const mockOnClose = jest.fn();
    render(<Drawer opened onClose={mockOnClose} />);

    const headerElement = screen.queryByRole('dialog').firstElementChild;
    const closeButton = headerElement.querySelector('button');

    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
