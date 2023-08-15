import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import CopyButton from './CopyButton';
import { click } from '../../../__mocks__/eventMock';

describe('Copy Button: ', () => {
  it('renders copy icon only & validate default styles', () => {
    render(
      <CopyButton
        text="Copy Button Text"
        onCopy={(text: string) => {
          console.log(`copied-text`, text);
        }}
      />
    );
    const Button = screen.getByTestId('copy-button');
    expect(Button).toHaveClass(
      '!bg-transparent fc-copy bg-gray-800 text-app-foreground-inactive'
    );
    expect(screen.getByTestId('copy-icon')).toBeInTheDocument();
    expect(screen.getByTestId('copy-icon')).toHaveClass('align-baseline');
    expect(screen.queryByText('Copy Button Text')).not.toBeInTheDocument();
  });

  it('renders text preview with copy icon', () => {
    render(
      <CopyButton
        text="Copy Button Text"
        showText={true}
        onCopy={(text: string) => {
          console.log(`copied-text`, text);
        }}
      />
    );
    expect(screen.getByText('Copy Button Text')).toBeInTheDocument();
  });

  it('renders the "Copied!" text as animation on click event', async () => {
    render(
      <CopyButton
        text="Copy Button Text"
        showText={true}
        onCopy={(text: string) => {
          console.log(`copied-text`, text);
        }}
      />
    );

    let copyElement = screen.getByTestId('copy-icon');
    click(copyElement);

    await waitFor(() => screen.getByTestId('copy-button'));

    const copyActionText = screen.queryByText(/Copied/i);
    expect(copyActionText).toBeInTheDocument();
    expect(copyActionText).toHaveClass('text-sm');
  });

  it('renders the button without animation on click event', async () => {
    render(
      <CopyButton
        text="Copy Button Text"
        showText={true}
        animation={false}
        onCopy={(text: string) => {
          console.log(`copied-text`, text);
        }}
      />
    );

    let copyElement = screen.getByTestId('copy-icon');
    click(copyElement);

    await waitFor(() => screen.getByTestId('copy-button'));

    expect(screen.queryByText(/Copied/i)).not.toBeInTheDocument();
  });
});
