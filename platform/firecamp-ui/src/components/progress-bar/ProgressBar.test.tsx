import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ProgressBar, { IProgressBar } from "./ProgressBar";

const Template = (args: IProgressBar) => <ProgressBar {...args}/>
const ProgressBarArgs = {
    active: true
}
const InactiveProgressBarArgs = {
    active: false
}
const SmallProgressBarArgs = {
    active: true,
    short: true
}
describe("ProgressBar component:", () => {

    test("should not be visible when active is falsy", () => {
        render(<Template {...InactiveProgressBarArgs} />)
        const ProgressBarContainer = screen.queryByTestId('progress-bar');

        expect(ProgressBarContainer).toBeFalsy(); 
    });

    test("should be visible when active", () => {
        render(<Template {...ProgressBarArgs} />)
        const ProgressBarContainer = screen.getByTestId('progress-bar');

        expect(ProgressBarContainer).toHaveClass('progress-bar absolute left-0 bottom-0 w-full border-b-2 h-0 z-10 top-0 border-primaryColor');
        expect(ProgressBarContainer).not.toHaveClass('border-transparent');
    });

    test("should render with short width", () => {
        render(<Template {...SmallProgressBarArgs} />)
        const ProgressBarContainer = screen.getByTestId('progress-bar');

        expect(ProgressBarContainer).toHaveClass('progressbar-small');
    });

});