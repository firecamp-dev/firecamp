import '@testing-library/jest-dom';

/** @ref https://github.com/suren-atoyan/monaco-react/issues/88#issuecomment-887055307 */
jest.mock('@monaco-editor/react', () => {
  const FakeEditor = jest.fn((props) => {
    return (
      <textarea
        data-auto={props.wrapperClassName}
        onChange={(e) => props.onChange(e.target.value)}
        value={props.value}
        data-testId="url-editor"
      ></textarea>
    );
  });
  return FakeEditor;
});
