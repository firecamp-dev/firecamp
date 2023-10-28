import { useState } from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import Dropdown from "./Dropdown";
import Button from "../buttons/Button";
import { click } from "../../../__mocks__/eventMock";

const DropDownDemoArgs = {
    containerId: "dropdown-container",
    handlerId: "dropdown-handler",
    options: [{
        header: 'APIs',
        list: [{
            id: '1',
            name: 'Rest',
            prefix: '',
            postfix: '',
            disabled: false,
            className: ''
        },
        {
            id: '2',
            name: 'GraphQL',
            prefix: () => (
                <div className={'dropdown-icon'}>
                    gq
                </div>
            ),
            disabled: false,
            className: '',
            postfix: () => (
                <div className="dropdown-text">
                    <span className="ml-4">
                        Coming soon
                    </span>
                </div>
            )
        },
        {
            id: '3',
            name: 'Socket.io',
            prefix: '',
            postfix: () => (
                <div className="dropdown-text">
                    <span className="ml-4" >
                        Coming soon
                    </span>
                </div>
            ),
            disabled: false,
            className: ''
        },
        {
            id: '4',
            name: 'Websocket',
            prefix: '',
            postfix: '',
            disabled: true,
            className: ''
        }
        ]
    },
    {
        id: '5',
        name: 'Firecamp',
        prefix: '',
        postfix: '',
        disabled: false,
        className: ''
    }
    ] as any
};

const DropDownDemo = (args: any) => {

    let [selected, setSelected] = useState('GraphQL')

    return (
        <Dropdown selected={selected} id={DropDownDemoArgs.containerId}>
            <Dropdown.Handler id={DropDownDemoArgs.handlerId}>
                <Button text={selected} uppercase />
            </Dropdown.Handler>
            <Dropdown.Options
                hasDivider={true}
                options={DropDownDemoArgs.options}
                onSelect={item => {
                    setSelected(item.name || 'oops...')
                }} />
        </Dropdown>
    )
};

describe("Dropdown component", () => {

    test("should render the dropdown list with default selected value", () => {
        let { container } = render(<DropDownDemo />)

        // validate the handler text with default value
        let DropdownHandler = container.querySelector(`#${DropDownDemoArgs.handlerId}`);
        expect(DropdownHandler.textContent).toBe('GraphQL');

    });

    test('should display the correct number of options', () => {
        let { container } = render(<DropDownDemo />)

        // validate the handler options text with default value
        let DropdownOptions = container.querySelector(`#${DropDownDemoArgs.containerId}`).lastElementChild;
        let optionsCount = DropdownOptions.querySelectorAll("li");

        //count the total number of list items to be rendered in options
        let expectedListComponent = DropDownDemoArgs.options.reduce((total: number, value: any) => {
            if (Object.keys(value)?.includes('header')) {
                return total + value.list.length + 1; //+1 for the header list item
            }
            return total + 1;
        }, 0);

        expect(optionsCount.length).toBe(expectedListComponent)
    });

    test('should allow user to change the selected option', async () => {
        let { container } = render(<DropDownDemo />)

        let DropdownHandler = container.querySelector(`#${DropDownDemoArgs.handlerId}`) as HTMLElement;
        click(DropdownHandler);

        // validate the handler optionstext with default value
        let DropdownOptions = container.querySelector(`#${DropDownDemoArgs.containerId}`).lastElementChild;
        expect(DropdownOptions).toBeVisible();

        let ListElementClicked = DropdownOptions.querySelectorAll("li")[2];
        click(ListElementClicked);

        //handler name updated to the selected list option name & validating prefix & postfix for the option preview
        await waitFor(() => {
            expect(DropdownHandler.textContent).toBe(DropDownDemoArgs.options[0].list[1].name);
            expect(ListElementClicked.textContent).toBe('gqGraphQLComing soon')
        });
    });

});