import { useState } from "react";
import "@testing-library/jest-dom";
import { getByRole, getByText, render, screen, waitFor } from "@testing-library/react";
import { click } from "../../../__mocks__/eventMock";
// import { CheckboxGroup } from "@firecamp/ui-kit";
import CheckboxGroup from './CheckboxGroup';
import { ICheckbox } from "./interfaces/Checkbox.interfaces";

const CheckBoxPrimaryArg = {
    checkboxLabel: 'Transports',
    list: [
        {
            id: 'websocket',
            isChecked: false,
            label: 'Websocket',
            showLabel: true,
            disabled: false
        },
        {
            id: 'polling',
            isChecked: false,
            label: 'Polling',
            showLabel: true,
            disabled: false
        }
    ]
};


const TemplateWithState = (args: any) => {
    const [checkboxList, onToggleCheck] = useState(args.list);
    return <CheckboxGroup {...args}
        list={checkboxList}
        onToggleCheck={(value) => {
            let Index = checkboxList.findIndex((list: ICheckbox) => list.id == Object.keys(value)[0])
            let updatedList = checkboxList.map((list: ICheckbox, index: number) =>
                (index !== Index ? list : { ...list, isChecked: Object.values(value)[0] })
            );
            onToggleCheck(updatedList);
        }} />

}

describe("Checkbox component : ", () => {

    const mountCheckBoxGroup = (args = {}) => render(<TemplateWithState {...Object.assign({}, CheckBoxPrimaryArg, args)} />);

    test("should render & update on showLabel arg", async () => {
        let { container, unmount } = mountCheckBoxGroup();
        let CheckboxGroupWrapper = container.firstElementChild;

        expect(CheckboxGroupWrapper.childElementCount).toBe(2);
        expect(CheckboxGroupWrapper.firstElementChild.textContent).toBe(CheckBoxPrimaryArg.checkboxLabel + ": ");
        expect(CheckboxGroupWrapper.firstElementChild).toHaveClass("cursor-pointer");

        let CheckboxListWrapper = CheckboxGroupWrapper.lastElementChild.firstElementChild;

        expect(CheckboxListWrapper).toHaveClass("flex");
        expect(CheckboxListWrapper.childElementCount).toBe(CheckBoxPrimaryArg.list.length);

        unmount();

        //validate in case showLabel is false
        let { container: containerWithoutLabel } = mountCheckBoxGroup({ showLabel: false });
        {
            let CheckboxGroupWrapper = containerWithoutLabel.firstElementChild;
            expect(CheckboxGroupWrapper.childElementCount).toBe(1);
        }

    });

    test("should update based check value", async () => {

        let { container } = mountCheckBoxGroup();
        let CheckboxGroupWrapper = container.firstElementChild;

        let CheckboxListWrapper = CheckboxGroupWrapper.lastElementChild;
        let lastCheckbox = CheckboxListWrapper.firstElementChild.lastElementChild as HTMLElement;
        let CheckboxInput = getByRole(lastCheckbox, "checkbox") as HTMLInputElement;

        //validating the change in checkbox input on click event
        click(CheckboxInput);

        await waitFor(() => {
            // screen.debug(lastCheckbox);

            expect(CheckboxInput.checked).toBeTruthy();

            let checkIconVisible = getByText(lastCheckbox, "IconCheck");
            expect(checkIconVisible).toBeInTheDocument();
        });

    })
});
