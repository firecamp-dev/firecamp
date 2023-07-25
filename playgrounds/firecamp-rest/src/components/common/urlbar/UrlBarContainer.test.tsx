import { render, screen } from "@testing-library/react"

import UrlBarContainer from "./UrlBarContainer"
import useUrlBarFacade from "./useUrlBarFacade"

jest.mock("./useUrlBarFacade", () => jest.fn())

describe("Users component", () => {
  test("should show loading state when fetching data", () => {
    useUrlBarFacade.mockImplementationOnce(() => ({
      url: { raw: "https://firecamp.io" },
    }))
    render(<UrlBarContainer />)
    expect(screen.getByTestId("loading")).toBeInTheDocument()
  })
})
