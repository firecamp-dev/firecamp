import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import FileInput from './FileInput';
import { click } from '../../../__mocks__/eventMock';

describe('FileInput: ', () => {
  it('renders the File Input components', () => {
    render(<FileInput data-testid="file-input-element" />);
    expect(screen.getByTestId('file-input-element')).toBeInTheDocument();
  });
  it('render placeholder text', () => {
    const { container } = render(
      <FileInput data-testid="file-input-element" placeholder="select file" />
    );
    expect(container.textContent).toBe('select file');
  });
  it('render file name [with prefix of file: ]', () => {
    const { container } = render(
      <FileInput
        data-testid="file-input-element"
        placeholder="select file"
        value={{ name: 'sample-file' } as File}
      />
    );
    expect(container.textContent).toBe('file: sample-file');
  });
  it('trigger the file selection function also when file is selected', () => {
    const mockOnFileChange = jest.fn();
    render(
      <FileInput
        data-testid="file-input-element"
        placeholder="select file"
        onChange={() => mockOnFileChange()}
        value={{ name: 'sample-file' } as File}
      />
    );

    click(screen.getByTestId('file-input-element'));
    waitFor(() => expect(mockOnFileChange).toHaveBeenCalled());
  });
});
