//@ts-nocheck
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { change } from "../../../__mocks__/eventMock";

import { useRef, useState } from "react";
import { useForm } from 'react-hook-form';
import { VscMenu } from "@react-icons/all-files/vsc/VscMenu";

import Button from "../buttons/Button";
import Inputv2 from "./Inputv2";

const InputProps = {
    placeholder: "Enter E-mail",
    name: 'email',
    label: "Email",
    id: 'user-email'
}
// Todo write test case with using 'react-hook-form'
function TemplateWithReactHookForm() {

    const additionalRef = useRef();
    const [dummyInput, setDummyInput] = useState('');
    const { register, handleSubmit, errors } = useForm();

    const onSubmit = (data: { [k: string]: any }) => console.log(`on-form-submit`, data);
    const onErrors = (errors: { [k: string]: any }) => console.error('on-form-error', errors);

    return (<form onSubmit={handleSubmit(onSubmit, onErrors)}>
        <Inputv2
            placeholder="Enter E-mail"
            name={'email'}
            label="Email"
            id='user-email'
            ref={
                register({
                    required: {
                        value: true,
                        message: "Email is required"
                    },
                    maxLength: 50,
                    minLength: 5,
                    pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/,
                })
            }
            autoFocus={true}
            error={
                (errors?.email) ? errors?.email?.message || 'Invalid email' : ''
            }
        />
        <Inputv2 type="password"
            id='user-password'
            label='Password'
            placeholder='Enter Password'
            name="password"
            ref={register({ required: true, minLength: 6 })}
            error={
                (errors?.password) ?
                    (errors.password.type === "required" ? "Password is required." : "Password should be at-least 6 characters.") : ''
            }
        />
        <Inputv2
            id='extra-details'
            label='Dummy input - not added in form submit'
            placeholder='Enter Password'
            name="dummy input"
            ref={additionalRef}
            note={"Note preview"}
            value={dummyInput}
            onChange={({ target: { value } }) => setDummyInput(value)}
        />
        <div className="form-control">
            <Button
                color="primary"
                text={`Submit`}
                fullWidth={true}
                size="md"
                onClick={() => handleSubmit(onSubmit, onErrors)}
            />
        </div>
    </form>);
}

const InputElementTemplate = (args = {}) => {
    const [inputValue, updateInputValue] = useState('');

    return <Inputv2 {...InputProps} {...args} value={inputValue} onChange={(e) => updateInputValue(e.target.value)} />
}
describe("Input component: ", () => {

    test("should render with default stylings and provided props", async () => {

        render(<InputElementTemplate />)

        let InputElement = screen.getByRole('textbox', { placeholder: InputProps.placeholder });

        //Input element exists
        expect(InputElement).toBeInTheDocument();

        //Input element default styles
        expect(InputElement).toHaveClass('border !border-inputBorder rounded-sm p-2 leading-5 outline-none placeholder-inputPlaceholder text-base focus:bg-inputFocusBackground w-full bg-inputBackground');

        //Input element wrapper div with default styles
        expect(InputElement.parentElement).toHaveClass('w-full relative');

        //Input element props with all provided attributes
        expect(InputElement).toHaveAttribute('name', InputProps.name);
        expect(InputElement).toHaveAttribute('id', InputProps.id);

        //update the value & validate the input value
        change(InputElement, "input change");
        await waitFor(() => expect(InputElement.value).toBe("input change"));
    });

    test("should render with label text", async () => {

        let wrapperClassName = "wrapper-div"
        let { container } = render(<InputElementTemplate wrapperClassName={wrapperClassName} />);
        let InputWrapper = container.firstElementChild;

        //validate input component div wrapper styles
        expect(InputWrapper).toHaveClass('relative items-center text-inputText text-sm w-full mb-5 ' + wrapperClassName);

        //Input element exists
        let InputElement = screen.getByRole('textbox');
        expect(InputElement).toBeInTheDocument();

        //validate the label text & its styles
        let labelElement = InputWrapper.firstElementChild;
        expect(labelElement.textContent).toBe(InputProps.label);
        expect(labelElement.className).toBe("text-appForeground text-sm mb-1 block");

    });

    test("should render with icon & validate its placement", async () => {

        let { unmount } = render(<InputElementTemplate icon={<VscMenu title="menu-icon" size={16} />} label={""} />);

        //validate icon location to be in left direction
        let InputElement = screen.getByRole('textbox');
        expect(InputElement).toBeInTheDocument();
        expect(InputElement).toHaveClass('!pl-9');

        //Icon element exists
        let IconElement = screen.queryByText("menu-icon")
        expect(IconElement).toBeInTheDocument();

        let IconWrapperDiv = IconElement.parentElement.parentElement;
        expect(IconWrapperDiv).toHaveClass('absolute top-3 cursor-pointer left-2');

        unmount();
        render(<InputElementTemplate icon={<VscMenu title="menu-icon" size={16} />} iconPosition="right" label={""} />);

        //validate icon location to be in right direction
        let IconElement = screen.queryByText("menu-icon")
        let IconWrapperDiv = IconElement.parentElement.parentElement;
        expect(IconWrapperDiv).toHaveClass('absolute top-3 cursor-pointer right-2');

    });

    test("should render with error message", async () => {
        let ErrorMessage = "Error Message"
        render(<InputElementTemplate error={ErrorMessage} />);

        //validate icon location to be in left direction
        let InputElement = screen.getByRole('textbox');
        expect(InputElement).toBeInTheDocument();

        //validate the error message to be rendered along with defined styles
        let ErrorElement = InputElement.parentElement.lastElementChild;
        expect(ErrorElement.textContent).toBe(ErrorMessage)
        expect(ErrorElement).toHaveClass("text-sm font-light text-error block absolute")

    });

    test("should render with custom note message", async () => {
        let NoteMessage = "Note Message"
        render(<InputElementTemplate note={NoteMessage} />);

        //validate input element to be rendered
        let InputElement = screen.getByRole('textbox');
        expect(InputElement).toBeInTheDocument();

        //validate the note message to be rendered along with defined styles & info icon
        let NoteElement = InputElement.parentElement.lastElementChild;
        expect(NoteElement).toHaveClass("text-xs text-appForeground  flex items-center")
        expect(NoteElement.textContent).toBe('info-icon' + NoteMessage);
    });

    test("should render with custom component after input component", async () => {
        const Component = <div>Custom Component</div>;
        render(<InputElementTemplate postComponents={Component} />);

        //validate input element to be rendered
        let InputElement = screen.getByRole('textbox');
        expect(InputElement).toBeInTheDocument();

        //validate the additional component to be rendered
        let PostComponentElement = InputElement.parentElement.lastElementChild;
        expect(PostComponentElement.textContent).toBe('Custom Component');
    });

});
