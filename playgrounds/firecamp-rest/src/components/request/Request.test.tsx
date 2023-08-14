import { render, screen, fireEvent } from "@testing-library/react"
import { useRequestHeadersFacade, useRequestParamsFacade } from "./useFacade"
import HeadersTab from "./tabs/HeadersTab";
import ParamsTab from "./tabs/ParamsTab";

jest.mock("./useFacade", () => {
  const originalModule = jest.requireActual('./useFacade');
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(),
    useRequestHeadersFacade: jest.fn(),
    useRequestParamsFacade: jest.fn(),
  };
});

describe("Rest Playground: Request Panel", () => {

  const prepareHeadersStore = (state = {}) => {
    //@ts-ignore
    useRequestHeadersFacade.mockImplementationOnce(() => (state));
  };
  const prepareParamsStore = (state = {}) => {
    //@ts-ignore
    useRequestParamsFacade.mockImplementationOnce(() => (state));
  };

  describe('Headers Tab:', () => {

    const Component = HeadersTab
    test("should render table with title and two empty rows", () => {
      prepareHeadersStore({ headers: [], authHeaders: [] });
      render(<Component />);

      const tTitle = screen.getByTestId("table-title");
      expect(tTitle).toBeInTheDocument();
      expect(tTitle).toHaveTextContent('Headers');

      const beButton = screen.getByTestId("bulk-edit-button");
      expect(beButton).toBeInTheDocument();
      expect(beButton).toHaveTextContent('Bulk Edit');

      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(3); // 1 tr in thead and 2 tr in tbody
    });

    test("should render table with two headers row", () => {
      prepareHeadersStore({
        headers: [
          { key: "Accept", value: "application/json" },
          { key: "ApiKey", value: "secret" },
        ], authHeaders: []
      });
      render(<Component />);

      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(3); // 1 tr in thead and 2 tr in tbody

      fireEvent.click(screen.getByRole('button', { name: "Add Row" }));
      expect(screen.getAllByRole('row')).toHaveLength(4); // new row added

      const cell1 = screen.getByRole('cell', { name: "Accept" });
      expect(cell1).toBeInTheDocument();

      const cell2 = screen.getByRole('cell', { name: "ApiKey" });
      expect(cell2).toBeInTheDocument();
    });

    test("should add new header row on 'Add Row' button click", () => {
      prepareHeadersStore({
        headers: [
          { key: "Accept", value: "application/json" },
          { key: "ApiKey", value: "secret" },
        ], authHeaders: []
      });
      render(<Component />);

      fireEvent.click(screen.getByRole('button', { name: "Add Row" }));
      expect(screen.getAllByRole('row')).toHaveLength(4);
    });

    test("should render two tables if auth headers exists", () => {
      prepareHeadersStore({
        headers: [{ key: "Accept", value: "application/json" }],
        authHeaders: [{ key: "AuthToken", value: "secret" }]
      });
      render(<Component />);

      const tables = screen.getAllByRole('table');
      expect(tables).toHaveLength(2);

      const authTableCell = screen.getAllByRole('cell', { name: "AuthToken" });
      expect(authTableCell).toHaveLength(1);
    });

  });

  describe('Params Tab:', () => {

    const Component = ParamsTab;
    test("should render table with title and two empty rows", () => {
      prepareParamsStore({ queryParams: [], pathParams: [] });
      render(<Component />);

      const tTitle = screen.getByTestId("table-title");
      expect(tTitle).toBeInTheDocument();
      expect(tTitle).toHaveTextContent('Query Params');

      const beButton = screen.getByTestId("bulk-edit-button");
      expect(beButton).toBeInTheDocument();
      expect(beButton).toHaveTextContent('Bulk Edit');

      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(3); // 1 tr in thead and 2 tr in tbody
    });

    test("should render table with two query params row", () => {
      prepareParamsStore({ queryParams: [{ key: "name", value: "foo" }, { key: "surname", value: "bar" }], pathParams: [] });
      render(<Component />);

      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(1 + 2); // 1 tr in thead and 2 tr in tbody

      fireEvent.click(screen.getByRole('button', { name: "Add Row" }));
      expect(screen.getAllByRole('row')).toHaveLength(4); // new row added

      // const cell1 = screen.getByRole('cell', { name: "name" });
      // expect(cell1).toBeInTheDocument();

      const cell2 = screen.getByRole('cell', { name: "surname" });
      expect(cell2).toBeInTheDocument();
    });

    test("should add new param row on 'Add Row' button click", () => {
      prepareParamsStore({ queryParams: [{ key: "name", value: "foo" }, { key: "surname", value: "bar" }], pathParams: [] });
      render(<Component />);

      fireEvent.click(screen.getByRole('button', { name: "Add Row" }));
      expect(screen.getAllByRole('row')).toHaveLength(4);
    });

    test("should render two tables if path params exists", () => {
      prepareParamsStore({ queryParams: [{ key: "name", value: "foo" }], pathParams: [{ key: "surname", value: "bar" }] });
      render(<Component />);

      const tables = screen.getAllByRole('table');
      expect(tables).toHaveLength(2);

      const pathTableCell = screen.getAllByRole('cell', { name: "surname" });
      expect(pathTableCell).toHaveLength(1);
    });

  });

});


