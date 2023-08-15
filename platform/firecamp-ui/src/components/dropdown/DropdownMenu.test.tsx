import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import DropdownMenu from './DropdownMenu';
import { IDropdownMenu } from './DropdownMenu.interfaces';
import ResizeObserver from '../../../__mocks__/ResizeObserver';

const DropdownMenuExample = (args: Partial<IDropdownMenu>) => {
  let [selected, setSelected] = useState('GraphQL');

  return (
    <DropdownMenu
      data-testid="dropdown-menu"
      handler={() => <span data-testid="handler-element">{selected}</span>}
      onSelect={(value) => setSelected(value)}
      options={[
        {
          id: '1',
          name: 'Rest',
        },
        {
          id: '2',
          name: 'GraphQL',
          prefix: () => <div className={'dropdown-icon'}>Icon-</div>,
          postfix: () => (
            <div className="dropdown-text">
              <span className="ml-4">-Coming soon</span>
            </div>
          ),
        },
        {
          id: '3',
          name: 'Socket.io',
          postfix: () => (
            <div className="dropdown-text">
              <span className="ml-4">-Coming soon</span>
            </div>
          ),
        },
        {
          id: '4',
          name: 'Websocket',
        },
      ]}
      {...args}
    />
  );
};

window.ResizeObserver = ResizeObserver;

describe('DropdownMenu:', () => {
  it('renders component', () => {
    render(<DropdownMenuExample />);
    const handlerElement = screen.getByTestId('handler-element');
    expect(handlerElement).toBeTruthy();
  });
  it('renders all options correctly', () => {
    render(
      <DropdownMenuExample data-testid="dropdown-menu" id="dropdown-menu-id" />
    );
    const handlerElement = screen.getByTestId('handler-element');
    fireEvent.click(handlerElement);
    expect(screen.getByTestId('dropdown-menu')).toBeTruthy();
    const options = screen.getByRole('menu').firstChild;
    expect(options.childNodes.length).toBe(4);
    expect(options.childNodes[0].textContent).toBe('Rest');
    expect(options.childNodes[1].textContent).toBe('Icon-GraphQL-Coming soon');
    expect(options.childNodes[2].textContent).toBe('Socket.io-Coming soon');
    expect(options.childNodes[3].textContent).toBe('Websocket');
  });
  it('renders header & footer ', () => {
    render(
      <DropdownMenuExample
        header={<div>Header Element</div>}
        footer={<div>Footer Element</div>}
      />
    );
    const handlerElement = screen.getByTestId('handler-element');
    fireEvent.click(handlerElement);
    const options = screen.getByRole('menu').firstElementChild;
    expect(options.firstElementChild.textContent).toBe('Header Element');
    expect(options.lastElementChild.textContent).toBe('Footer Element');
  });
  it('renders click options', () => {
    const mockOnClose = jest.fn();
    render(
      <DropdownMenuExample
        footer={<div>Footer Element</div>}
        onSelect={mockOnClose}
      />
    );
    const handlerElement = screen.getByTestId('handler-element');
    fireEvent.click(handlerElement);
    const firstOption = screen.getByRole('menu').firstElementChild
      .childNodes[0] as HTMLButtonElement;
    fireEvent.click(firstOption);
    expect(mockOnClose).toHaveBeenCalled();
  });
  it('should not render options for handler click actions', () => {
    render(<DropdownMenuExample options={[]} />);
    const handlerElement = screen.getByTestId('handler-element');
    fireEvent.click(handlerElement);

    const options = screen.getByRole('menu').firstChild;
    expect(options.childNodes.length).toBe(0);
  });
  it('should not call the onSelect when disables', () => {
    const mockOnClose = jest.fn();
    render(<DropdownMenuExample onSelect={mockOnClose} disabled={true} />);
    const handlerElement = screen.getByTestId('handler-element');
    fireEvent.click(handlerElement);
    expect(screen.queryByRole('menu')).toBeFalsy();
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
