import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { click } from "../../../__mocks__/eventMock";
import { CheckBoxPrimary } from "./Checkbox.stories";
// import { Checkbox } from "@firecamp/ui-kit";

describe("Checkbox component : ", () => {

    const mountCheckBox = () => render(<CheckBoxPrimary {...CheckBoxPrimary.args} />);
    const getCheckBoxInputElement = () => screen.getByRole('checkbox');

    test("should be rendered & validate its click event updates", async () => {
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

    test("should verify the label text & its location", () => {
        let {container} = mountCheckBox();
        let CheckboxWrapper = container.firstElementChild;

        expect(CheckboxWrapper).toHaveClass(`${CheckBoxPrimary.args.className ? CheckBoxPrimary.args.className: ""} flex`);

        //validating label value based on 'showLabel' args
        if(typeof CheckBoxPrimary.args.showLabel === "undefined" || !!CheckBoxPrimary.args.showLabel){
            let CheckboxLabelSpanWrapper = CheckboxWrapper.firstElementChild;

            //validating the styles for the label tag wrapper along with the child element count in label
            if(CheckBoxPrimary.args.label === ""){
                expect(CheckboxLabelSpanWrapper).toHaveClass("fc-custom-checkbox !flex items-center mb-0 w-4");
                expect(CheckboxLabelSpanWrapper.childElementCount).toBe(1)
            }else{
                expect(CheckboxLabelSpanWrapper).toHaveClass("fc-custom-checkbox !flex items-center mb-0");
                expect(CheckboxLabelSpanWrapper.childElementCount).toBe(2)
                let labelSpan = screen.getByText(CheckBoxPrimary.args.label);
                
                //validating the location for the label element along with its classnames
                if(typeof CheckBoxPrimary.args.labelPlacing === "undefined" || CheckBoxPrimary.args.labelPlacing === "right" ){
                    expect(CheckboxLabelSpanWrapper.lastElementChild).toEqual(labelSpan);
                    expect(CheckboxLabelSpanWrapper.lastElementChild).toHaveClass("text-sm ml-2 cursor-pointer");
                }else{
                    expect(CheckboxLabelSpanWrapper.firstElementChild).toEqual(labelSpan);
                    expect(CheckboxLabelSpanWrapper.firstElementChild).toHaveClass("text-sm mr-2");
                }
            }
            
        
        }
        

    });

    test("should render the provided note text if provided", () => {
        let {container} = mountCheckBox();
        let CheckboxWrapper = container.firstElementChild;

        let CheckboxNoteDivWrapper = CheckboxWrapper.lastElementChild;
        
        //validate the note div wrapper when not is provided in the args
        if(typeof CheckBoxPrimary.args.note !== "undefined" && CheckBoxPrimary.args.note.length > 0){

            expect(CheckboxNoteDivWrapper).toHaveClass("fc-input-note");
            expect(CheckboxNoteDivWrapper.firstElementChild).toHaveClass("iconv2-info-icon");
            expect(CheckboxNoteDivWrapper.textContent).toBe(CheckBoxPrimary.args.note);

        }else{
            expect(CheckboxWrapper.childElementCount).toBe(1)
        }
        

    })
})