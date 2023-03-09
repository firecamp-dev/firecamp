import { useState } from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { click } from "../../../__mocks__/eventMock";
// import { Checkbox } from "@firecamp/ui-kit";
import Checkbox from './Checkbox';
import { ICheckbox } from './interfaces/Checkbox.interfaces';

const CheckBoxPrimary = {
    args: { 
        label: 'CheckBoxPrimary', 
        color: 'primary', 
        labelPlacing: 'right',
        isChecked: false,
        showLabel: true,
        className: ''
    }
}
const TemplateWithState = (args: ICheckbox) => {
    const [isChecked, onToggleCheck] = useState(args.isChecked);
    return <Checkbox {...args} isChecked={isChecked} onToggleCheck={(label, value) => onToggleCheck(value)} />
}

describe("Checkbox component : ", () => {

    const mountCheckBox = (args = {}) => render(<TemplateWithState {...Object.assign({}, CheckBoxPrimary.args, args)} />);
    const getCheckBoxInputElement = () => screen.getByRole('checkbox');

    test("should render & validate its click event updates", async () => {
        mountCheckBox();

        //checkbox input should be available
        let CheckboxInput = getCheckBoxInputElement() as HTMLInputElement;
        expect(CheckboxInput).toBeInTheDocument();

        //validating the styles for checkbox input div wrapper 
        let CheckboxInputDivWrapper = CheckboxInput.parentElement;
        expect(CheckboxInputDivWrapper).toHaveClass(`flex justify-center items-center cursor-pointer relative ${CheckBoxPrimary.args.color ? CheckBoxPrimary.args.color : "primary"}`);

        //validating styles of the checkbox preview of border & icon
        let checkIconBorderSpan = CheckboxInputDivWrapper.getElementsByTagName("span")[0];
        expect(checkIconBorderSpan).toHaveClass("border w-4 h-4 border-appForeground");
        expect(screen.queryByText("IconCheck")).toBeNull();

        //validating the change in checkbox input on click event
        click(CheckboxInputDivWrapper);
        await waitFor(() => {

            expect(CheckboxInput.checked).toBeTruthy();
            expect(checkIconBorderSpan).toHaveClass("border w-4 h-4 border-primaryColor");

            let checkIconVisible = screen.getByText("IconCheck");
            expect(checkIconVisible).toBeInTheDocument();
        });

    });

    test("should be disabled", async () => {
        mountCheckBox({disabled: true});

        let CheckboxInput = getCheckBoxInputElement() as HTMLInputElement;

        //validating the styles for checkbox input div wrapper 
        let CheckboxInputDivWrapper = CheckboxInput.parentElement;
        expect(CheckboxInputDivWrapper).toHaveClass( "opacity-50 cursor-default" );

        screen.debug(CheckboxInputDivWrapper)
        //validating the change in checkbox input on click event
        click(CheckboxInputDivWrapper);
        await waitFor(() => {
            expect(CheckboxInput.checked).toBeFalsy();
        });

    });

    test("should verify the label text & its location", () => {
        let { container, unmount } = mountCheckBox();
        let CheckboxWrapper = container.firstElementChild;

        expect(CheckboxWrapper).toHaveClass(`${CheckBoxPrimary.args.className ? CheckBoxPrimary.args.className : ""} flex`);

        //1: to display the label based on 'showLabel' args
        if (typeof CheckBoxPrimary.args.showLabel === "undefined" || !!CheckBoxPrimary.args.showLabel) {
            let CheckboxLabelSpanWrapper = CheckboxWrapper.firstElementChild;

            //2. to validate the styles for label tag wrapper & the child element count when label is not empty
            expect(CheckboxLabelSpanWrapper).toHaveClass("fc-custom-checkbox !flex items-center mb-0");
            expect(CheckboxLabelSpanWrapper.childElementCount).toBe(2)
            let labelSpan = screen.getByText(CheckBoxPrimary.args.label);

            //3. validating the location for the label element along with its classnames with label direction is undefined/right
            if (typeof CheckBoxPrimary.args.labelPlacing === "undefined" || CheckBoxPrimary.args.labelPlacing === "right") {
                expect(CheckboxLabelSpanWrapper.lastElementChild).toEqual(labelSpan);
                expect(CheckboxLabelSpanWrapper.lastElementChild).toHaveClass("text-sm ml-2 cursor-pointer");
            }
        }
        unmount();

        //4. validating the location for the label element along with its classnames when label direction is left
        let { container: containerWithLabelOnLeft, unmount: unmountWithLabelOnLeft } = mountCheckBox({ labelPlacing: "left" });
        {
            let CheckboxLabelSpanWrapper = containerWithLabelOnLeft.firstElementChild.firstElementChild;
            let labelSpan = screen.getByText(CheckBoxPrimary.args.label);
            expect(CheckboxLabelSpanWrapper.firstElementChild).toEqual(labelSpan);
            expect(CheckboxLabelSpanWrapper.firstElementChild).toHaveClass("text-sm mr-2");
            unmountWithLabelOnLeft();
        }

        //5. to prevent the label to be rendered based on 'showLabel' args
        let { container: containerWithoutLabel } = mountCheckBox({ showLabel: false });
        {
            let CheckboxLabelSpanWrapper = containerWithoutLabel.firstElementChild.firstElementChild;
            expect(CheckboxLabelSpanWrapper.childElementCount).toBe(1)
        }
    });

    test("should render with and without the provided note text", () => {
        const CUSTOM_NOTE = "a note text";
        let { container, unmount } = mountCheckBox({ note: CUSTOM_NOTE });
        let CheckboxWrapper = container.firstElementChild;

        let CheckboxNoteDivWrapper = CheckboxWrapper.lastElementChild;

        //1. validate the note div wrapper when note is provided in the args
        if (CUSTOM_NOTE.length > 0) {
            expect(CheckboxNoteDivWrapper).toHaveClass("fc-input-note");
            expect(CheckboxNoteDivWrapper.firstElementChild).toHaveClass("icv2-info-icon");
            expect(CheckboxNoteDivWrapper.textContent).toBe(CUSTOM_NOTE);
        }
        unmount();
        //2. validate the note div wrapper not rendered 
        let { container: containerWithoutNote } = mountCheckBox({ note: "" });
        {
            let CheckboxWrapper = containerWithoutNote.firstElementChild;
            expect(CheckboxWrapper.childElementCount).toBe(1);
        }

    })
});