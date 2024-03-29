import '@testing-library/jest-dom';

/** @ref https://github.com/suren-atoyan/monaco-react/issues/88#issuecomment-887055307 */
jest.mock('@monaco-editor/react', () => {
  const FakeEditor = jest.fn((props) => {
    return (
      <textarea
        data-auto={props.wrapperClassName}
        onChange={(e) => props.onChange(e.target.value)}
        value={props.value}
        data-testid="single-line-editor"
      ></textarea>
    );
  });
  return FakeEditor;
});

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));