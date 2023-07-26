import { render, screen } from "@testing-library/react"
import UrlBarContainer from "./UrlBarContainer"
import useUrlBarFacade, { useUrlBarSuffixButtonsFacade } from "./useUrlBarFacade"

jest.mock("./useUrlBarFacade", () => {
  const originalModule = jest.requireActual('./useUrlBarFacade');
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(),
    useUrlBarSuffixButtonsFacade: jest.fn(),
  };
});

/** @ref https://github.com/suren-atoyan/monaco-react/issues/88#issuecomment-887055307 */
jest.mock("@monaco-editor/react", () => {
  const FakeEditor = jest.fn(props => {
    return (
      <textarea
        data-auto={props.wrapperClassName}
        onChange={e => props.onChange(e.target.value)}
        value={props.value}
        data-testId="url-editor"
      ></textarea>
    );
  });
  return FakeEditor;
});

describe("UrlBarContainer render", () => {

  const prepareStore = (a = {}, b = {}) => {
    //@ts-ignore
    useUrlBarFacade.mockImplementationOnce(() => (a));
    //@ts-ignore
    useUrlBarSuffixButtonsFacade.mockImplementationOnce(() => (b))
  }
  test("should have default ui: path, copy button, method dropdown, url value, send and save buttons", () => {
    prepareStore({
      url: { raw: "https://firecamp.io" },
      method: "GET"
    });
    render(<UrlBarContainer />);

    const urlEditor = screen.getByTestId("url-editor");
    expect(urlEditor).toBeInTheDocument();
    expect(urlEditor).toHaveTextContent('https://firecamp.io');

    const reqPath = screen.getByTestId("request-path");
    expect(reqPath).toBeInTheDocument();
    expect(reqPath).toHaveTextContent('Untitled Request');

    const copyBtn = screen.getByTestId("copy-button")
    expect(copyBtn).toBeInTheDocument();

    const methodBtn = screen.getByTestId("http-method-label")
    expect(methodBtn).toBeInTheDocument();
    expect(methodBtn).toHaveAttribute('title', 'HTTP Method');
    expect(methodBtn).toHaveTextContent('GET');

    const sendBtn = screen.getByTestId("send-request")
    expect(sendBtn).toBeInTheDocument();
    expect(sendBtn).toHaveAttribute('title', 'Send Request');
    expect(sendBtn).toHaveTextContent('Send');

    const saveBtn = screen.getByTestId("save-request")
    expect(saveBtn).toBeInTheDocument();
    expect(saveBtn).toHaveAttribute('title', 'Save Request');
    expect(saveBtn).toHaveTextContent('Save');
  });

  test("should have POST method selected", () => {
    prepareStore({
      url: { raw: "https://firecamp.io" },
      method: "POST"
    });
    render(<UrlBarContainer />);
    const methodBtn = screen.getByTestId("http-method-label")
    expect(methodBtn).toBeInTheDocument();
    expect(methodBtn).toHaveAttribute('title', 'HTTP Method');
    expect(methodBtn).toHaveTextContent('POST');
  });


  test("should have request path shown", () => {
    prepareStore({
      url: { raw: "https://firecamp.io" },
      requestPath: { path: "Firecamp Collection > Create Request" }
    });
    render(<UrlBarContainer />);
    const reqPath = screen.getByTestId("request-path")
    expect(reqPath).toBeInTheDocument();
    expect(reqPath).toHaveTextContent('Firecamp Collection > Create Request');
  });
})
