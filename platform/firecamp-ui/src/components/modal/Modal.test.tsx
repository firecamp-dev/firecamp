import '@testing-library/jest-dom';
import { screen, render, fireEvent } from '@testing-library/react';
import Modal from './Modal';
import ResizeObserver from '../../../__mocks__/ResizeObserver';

window.ResizeObserver = ResizeObserver;

describe('Modal: ', () => {
  it('renders modal component', () => {
    render(
      <Modal opened={true} onClose={() => {}} title="Modal Title">
        Modal Container
      </Modal>
    );
    expect(screen.getByText('Modal Container')).toBeInTheDocument();
  });

  it('should not renders modal component', () => {
    render(
      <Modal opened={false} onClose={() => {}} title="Modal Title">
        Modal Container
      </Modal>
    );
    expect(screen.queryByText('Modal Container')).toBeFalsy();
  });

  it('renders custom styles', () => {
    render(<Modal opened onClose={() => {}} />);

    const contentElement = screen.queryByRole('dialog');
    expect(contentElement).toHaveClass('invisible-scrollbar');
  });

  test('calls onClose when modal is closed', () => {
    const mockOnClose = jest.fn();
    render(<Modal opened onClose={mockOnClose} />);

    const headerElement = screen.queryByRole('dialog').firstElementChild;
    const closeButton = headerElement.querySelector('button');

    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
