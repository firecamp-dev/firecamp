import { render, screen } from "@testing-library/react"
import UrlBarContainer from "./UrlBarContainer"
import useUrlBarFacade, { useUrlBarPrefixButtonsFacade } from "./useUrlBarFacade"

jest.mock("./useUrlBarFacade",() => {
  const originalModule = jest.requireActual('./useUrlBarFacade');
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(),
    useUrlBarPrefixButtonsFacade: jest.fn(),
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
      ></textarea>
    );
  });
  return FakeEditor;
});

describe("UrlBarContainer render", () => {
  test("should have method dropdown, url value, send and save buttons", () => {
    //@ts-ignore
    useUrlBarFacade.mockImplementationOnce(() => ({
      url: { raw: "https://firecamp.io" },
    }));
    //@ts-ignore
    useUrlBarPrefixButtonsFacade.mockImplementationOnce(() => ({}))
    render(<UrlBarContainer />)
    expect(screen.getByText("https://firecamp.io")).toBeInTheDocument();
    expect(screen.getByTitle("HTTP Method")).toBeInTheDocument();
    expect(screen.getByTitle("Send Request")).toBeInTheDocument();
    expect(screen.getByTitle("Save Request")).toBeInTheDocument();
  })
})
